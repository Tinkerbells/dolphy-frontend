import React, { useState } from 'react'
// src/application/study-deck.ts
import { inject, injectable } from 'inversify'

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

import { SYMBOLS } from '../di/symbols'
import { updateDeckLastStudied } from '../domain/deck'
// Keep the old hook for backward compatibility during transition
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

@injectable()
export class StudyDeckService {
  constructor(
    @inject(SYMBOLS.CardStorageService) private cardStorage: CardStorageService,
    @inject(SYMBOLS.DeckStorageService) private deckStorage: DeckStorageService,
    @inject(SYMBOLS.StudySessionStorageService) private sessionStorage: StudySessionStorageService,
    @inject(SYMBOLS.UserStorageService) private userStorage: UserStorageService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
  ) {}

  // Add a ref to track if we've already started a session
  private sessionStartedRef = React.createRef<boolean>()

  public studyState = {
    currentCardIndex: 0,
    studyCards: [] as Card[],
    showAnswer: false,
    startTime: Date.now(),
  }

  setStudyState(newState: Partial<typeof this.studyState>) {
    this.studyState = { ...this.studyState, ...newState }
    return this.studyState
  }

  startStudySession(deckId: UniqueId): StudySession | undefined {
    // Check if session is already started to prevent infinite loops
    if (this.sessionStartedRef.current) {
      return this.sessionStorage.currentSession
    }

    // Mark session as started
    if (!this.userStorage.user) {
      this.notifier.notify('You need to be logged in to study')
      return undefined
    }

    // Get the deck
    const deck = this.deckStorage.getDeck(deckId)
    if (!deck) {
      this.notifier.notify('Deck not found')
      return undefined
    }

    // Get cards for study
    const allDeckCards = this.cardStorage.getCardsByDeck(deckId)
    if (allDeckCards.length === 0) {
      this.notifier.notify('This deck has no cards to study')
      return undefined
    }

    // Prepare cards for study
    const { newCardsPerDay, reviewsPerDay } = this.userStorage.user.preferences

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
      this.notifier.notify('No cards due for study in this deck')
      return undefined
    }

    // Create a new study session
    const session = createStudySession(deckId)
    this.sessionStorage.createSession(session)
    this.sessionStorage.setCurrentSession(session)

    // Update study state
    this.setStudyState({
      currentCardIndex: 0,
      studyCards,
      showAnswer: false,
      startTime: Date.now(),
    })

    // Update deck's last studied timestamp
    const updatedDeck = updateDeckLastStudied(deck)
    this.deckStorage.updateDeck(updatedDeck)

    return session
  }

  getCurrentCard(): Card | undefined {
    const { currentCardIndex, studyCards } = this.studyState
    return studyCards[currentCardIndex]
  }

  showAnswer(): void {
    this.setStudyState({
      showAnswer: true,
    })
  }

  answerCard(reviewType: ReviewType): void {
    const currentSession = this.sessionStorage.currentSession
    if (!currentSession) {
      this.notifier.notify('No active study session')
      return
    }

    const currentCard = this.getCurrentCard()
    if (!currentCard) {
      this.notifier.notify('No current card to answer')
      return
    }

    // Calculate time spent on this card
    const timeSpent = Date.now() - this.studyState.startTime

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
    this.cardStorage.updateCard(updatedCard)

    // Check if we've completed all cards
    const nextIndex = this.studyState.currentCardIndex + 1
    if (nextIndex >= this.studyState.studyCards.length) {
      // Complete the session
      const completedSession = completeSession(updatedSession)
      this.sessionStorage.updateSession(completedSession)
      this.sessionStorage.setCurrentSession(undefined)
      this.notifier.notify('Study session completed!')
      return
    }

    // Move to the next card
    this.sessionStorage.updateSession(updatedSession)
    this.setStudyState({
      currentCardIndex: nextIndex,
      showAnswer: false,
      startTime: Date.now(),
    })
  }

  pauseStudySession(): void {
    const currentSession = this.sessionStorage.currentSession
    if (!currentSession)
      return

    const updatedSession = pauseSession(currentSession)
    this.sessionStorage.updateSession(updatedSession)
  }

  resumeStudySession(): void {
    const currentSession = this.sessionStorage.currentSession
    if (!currentSession)
      return

    const updatedSession = resumeSession(currentSession)
    this.sessionStorage.updateSession(updatedSession)

    // Reset the timer for the current card
    this.setStudyState({
      startTime: Date.now(),
    })
  }

  endStudySession(): void {
    const currentSession = this.sessionStorage.currentSession
    if (!currentSession)
      return

    const completedSession = completeSession(currentSession)
    this.sessionStorage.updateSession(completedSession)
    this.sessionStorage.setCurrentSession(undefined)
    this.notifier.notify('Study session ended')
  }

  getStudyState() {
    return this.studyState
  }
}

export function useStudyDeck() {
  const cardStorage = useCardsStorage()
  const deckStorage = useDecksStorage()
  const sessionStorage = useStudySessionStorage()
  const userStorage = useUserStorage()
  const notifier = useNotifier()

  const service = new StudyDeckService(
    cardStorage,
    deckStorage,
    sessionStorage,
    userStorage,
    notifier,
  )

  // Create a React state wrapper around the service's state for UI updates
  const [studyState, setStudyState] = useState(service.getStudyState())

  // Wrap methods to update the React state
  return {
    studyState,
    startStudySession: (deckId: UniqueId) => {
      const result = service.startStudySession(deckId)
      setStudyState(service.getStudyState())
      return result
    },
    getCurrentCard: () => service.getCurrentCard(),
    showAnswer: () => {
      service.showAnswer()
      setStudyState(service.getStudyState())
    },
    answerCard: (reviewType: ReviewType) => {
      service.answerCard(reviewType)
      setStudyState(service.getStudyState())
    },
    pauseStudySession: () => {
      service.pauseStudySession()
      setStudyState(service.getStudyState())
    },
    resumeStudySession: () => {
      service.resumeStudySession()
      setStudyState(service.getStudyState())
    },
    endStudySession: () => {
      service.endStudySession()
      setStudyState(service.getStudyState())
    },
  }
}
