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
import { updateCardDifficulty } from '../domain/card'
import { updateDeckLastStudied } from '../domain/deck'
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
    // Mark session as started

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

    // Get due cards sorted by priority

    // Limit cards based on user preferences

    // Combine and re-sort

    // Create a new study session
    const session = createStudySession(deckId)
    this.sessionStorage.createSession(session)
    this.sessionStorage.setCurrentSession(session)

    // Update study state
    this.setStudyState({
      currentCardIndex: 0,
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
