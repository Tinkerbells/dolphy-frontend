import { inject, injectable } from 'inversify'

import type { Card } from '../domain/card'
import type { CardService } from './card-service'
import type { DeckService } from './deck-service'
import type {
  ReviewType,
  StudySession,
} from '../domain/study'
import type { StudySessionRepository } from '../repositories/study-session-repository'

import { SYMBOLS } from '../di/symbols'
import {
  addReview,
  completeSession,
  createStudySession,
  reviewTypeToDifficulty,
} from '../domain/study'

@injectable()
export class StudyService {
  constructor(
    @inject(SYMBOLS.StudySessionRepository) private sessionRepository: StudySessionRepository,
    @inject(SYMBOLS.CardService) private cardService: CardService,
    @inject(SYMBOLS.DeckService) private deckService: DeckService,
  ) {}

  async startSession(deckId: string): Promise<{ session: StudySession, cards: Card[] }> {
    // Update deck's last studied timestamp
    const updatedDeck = await this.deckService.updateDeckLastStudied(deckId)

    // Get cards for study
    const allDeckCards = await this.cardService.getCardsByDeck(deckId)
    if (allDeckCards.length === 0) {
      throw new Error('This deck has no cards to study')
    }

    // Create a new study session
    const session = createStudySession(deckId)
    await this.sessionRepository.create(session)

    return {
      session,
      cards: allDeckCards,
    }
  }

  async reviewCard(sessionId: string, cardId: string, reviewType: ReviewType): Promise<void> {
    // Get the session
    const session = await this.sessionRepository.getById(sessionId)
    if (!session) {
      throw new Error('Study session not found')
    }

    // Calculate time spent on this card (simplified)
    const timeSpent = 5000 // Placeholder, 5 seconds

    // Update the study session with this review
    const updatedSession = addReview(
      session,
      cardId,
      reviewType,
      timeSpent,
    )

    // Update the card's difficulty level based on the answer
    const difficulty = reviewTypeToDifficulty(reviewType)
    await this.cardService.updateCardDifficulty(cardId, difficulty)

    // Save session update
    await this.sessionRepository.update(updatedSession)
  }

  async endSession(sessionId: string): Promise<void> {
    const session = await this.sessionRepository.getById(sessionId)
    if (!session) {
      throw new Error('Study session not found')
    }

    const completedSession = completeSession(session)
    await this.sessionRepository.update(completedSession)
  }
}
