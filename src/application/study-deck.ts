import React, { useState } from 'react'

import type { Card } from '../domain/card'
import type {
  ReviewType,
  StudySession,
} from '../domain/study'
import type {
  CardStorageService,
  DeckStorageService,
  NotificationService,
  StudySessionStorageService,
  UserStorageService,
} from './ports'

import { updateDeckLastStudied } from '../domain/deck'
import { useNotifier } from '../services/notification-adapter'
import { sortCardsByDueness, updateCardDifficulty } from '../domain/card'
import {
  useCardsStorage,
  useDecksStorage,
  useStudySessionStorage,
  useUserStorage,
} from '../services/storage-adapter'
import {
  addReview,
  completeSession,
  createStudySession,
  pauseSession,
  resumeSession,
  reviewTypeToDifficulty,
} from '../domain/study'

export function useStudyDeck() {
  const cardStorage: CardStorageService = useCardsStorage()
  const deckStorage: DeckStorageService = useDecksStorage()
  const sessionStorage: StudySessionStorageService = useStudySessionStorage()
  const userStorage: UserStorageService = useUserStorage()
  const notifier: NotificationService = useNotifier()

  // Add a ref to track if we've already started a session
  const sessionStartedRef = React.useRef(false)

  const [studyState, setStudyState] = useState<{
    currentCardIndex: number
    studyCards: Card[]
    showAnswer: boolean
    startTime: number // For timing individual card reviews
  }>({
    currentCardIndex: 0,
    studyCards: [],
    showAnswer: false,
    startTime: Date.now(),
  })

  function startStudySession(deckId: UniqueId): StudySession | undefined {
    // Check if session is already started to prevent infinite loops
    if (sessionStartedRef.current) {
      return sessionStorage.currentSession
    }

    // Mark session as started
    sessionStartedRef.current = true
    if (!userStorage.user) {
      notifier.notify('You need to be logged in to study')
      return undefined
    }

    // Get the deck
    const deck = deckStorage.getDeck(deckId)
    if (!deck) {
      notifier.notify('Deck not found')
      return undefined
    }

    // Get cards for study
    const allDeckCards = cardStorage.getCardsByDeck(deckId)
    if (allDeckCards.length === 0) {
      notifier.notify('This deck has no cards to study')
      return undefined
    }

    // Prepare cards for study
    const { newCardsPerDay, reviewsPerDay } = userStorage.user.preferences

    // Get due cards sorted by priority
    const dueCards = sortCardsByDueness(allDeckCards)

    // Limit cards based on user preferences
    const newCards = dueCards.filter(card => card.status === 'new').slice(0, newCardsPerDay)
    const reviewCards = dueCards
      .filter(card => card.status !== 'new')
      .slice(0, reviewsPerDay)

    // Combine and re-sort
    const studyCards = sortCardsByDueness([...newCards, ...reviewCards])

    if (studyCards.length === 0) {
      notifier.notify('No cards due for study in this deck')
      return undefined
    }

    // Create a new study session
    const session = createStudySession(deckId)
    sessionStorage.createSession(session)
    sessionStorage.setCurrentSession(session)

    // Update study state
    setStudyState({
      currentCardIndex: 0,
      studyCards,
      showAnswer: false,
      startTime: Date.now(),
    })

    // Update deck's last studied timestamp
    const updatedDeck = updateDeckLastStudied(deck)
    deckStorage.updateDeck(updatedDeck)

    return session
  }

  function getCurrentCard(): Card | undefined {
    const { currentCardIndex, studyCards } = studyState
    return studyCards[currentCardIndex]
  }

  function showAnswer(): void {
    setStudyState({
      ...studyState,
      showAnswer: true,
    })
  }

  function answerCard(reviewType: ReviewType): void {
    const currentSession = sessionStorage.currentSession
    if (!currentSession) {
      notifier.notify('No active study session')
      return
    }

    const currentCard = getCurrentCard()
    if (!currentCard) {
      notifier.notify('No current card to answer')
      return
    }

    // Calculate time spent on this card
    const timeSpent = Date.now() - studyState.startTime

    // Update the study session with this review
    const updatedSession = addReview(
      currentSession,
      currentCard.id,
      reviewType,
      timeSpent,
    )

    // Update the card's difficulty level based on the answer
    const difficulty = reviewTypeToDifficulty(reviewType)
    const updatedCard = updateCardDifficulty(currentCard, difficulty)
    cardStorage.updateCard(updatedCard)

    // Check if we've completed all cards
    const nextIndex = studyState.currentCardIndex + 1
    if (nextIndex >= studyState.studyCards.length) {
      // Complete the session
      const completedSession = completeSession(updatedSession)
      sessionStorage.updateSession(completedSession)
      sessionStorage.setCurrentSession(undefined)
      notifier.notify('Study session completed!')
      return
    }

    // Move to the next card
    sessionStorage.updateSession(updatedSession)
    setStudyState({
      ...studyState,
      currentCardIndex: nextIndex,
      showAnswer: false,
      startTime: Date.now(),
    })
  }

  function pauseStudySession(): void {
    const currentSession = sessionStorage.currentSession
    if (!currentSession)
      return

    const updatedSession = pauseSession(currentSession)
    sessionStorage.updateSession(updatedSession)
  }

  function resumeStudySession(): void {
    const currentSession = sessionStorage.currentSession
    if (!currentSession)
      return

    const updatedSession = resumeSession(currentSession)
    sessionStorage.updateSession(updatedSession)

    // Reset the timer for the current card
    setStudyState({
      ...studyState,
      startTime: Date.now(),
    })
  }

  function endStudySession(): void {
    const currentSession = sessionStorage.currentSession
    if (!currentSession)
      return

    const completedSession = completeSession(currentSession)
    sessionStorage.updateSession(completedSession)
    sessionStorage.setCurrentSession(undefined)
    notifier.notify('Study session ended')
  }

  return {
    studyState,
    startStudySession,
    getCurrentCard,
    showAnswer,
    answerCard,
    pauseStudySession,
    resumeStudySession,
    endStudySession,
  }
}
