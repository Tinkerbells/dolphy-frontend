import { inject, injectable } from 'inversify'

import type { ReviewCardDTO } from '../domain/card'
import type { StudySession, StudyStats } from '../domain/study'
import type { CardRepository } from '../repositories/card-repository'
import type { DeckRepository } from '../repositories/deck-repository'
import type { StudySessionRepository } from '../repositories/study-session-repository'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class StudyService {
  constructor(
    @inject(SYMBOLS.StudySessionRepository) private studySessionRepository: StudySessionRepository,
    @inject(SYMBOLS.CardRepository) private cardRepository: CardRepository,
    @inject(SYMBOLS.DeckRepository) private deckRepository: DeckRepository,
  ) {}

  // Start a new study session
  async startStudySession(userId: UniqueId, deckId: UniqueId): Promise<StudySession> {
    // Create a new study session
    const session = await this.studySessionRepository.createStudySession({
      deckId,
      userId,
    })

    // Update the last studied time for the deck
    await this.deckRepository.updateLastStudied(deckId)

    return session
  }

  // End a study session
  async endStudySession(sessionId: UniqueId): Promise<StudySession | undefined> {
    return this.studySessionRepository.endStudySession(sessionId)
  }

  // Process a card review and update session stats
  async processCardReview(
    sessionId: UniqueId,
    reviewData: ReviewCardDTO,
    isCorrect: boolean,
  ): Promise<void> {
    // Update the card's spaced repetition data
    await this.reviewCard(reviewData)

    // Get the current session
    const session = await this.studySessionRepository.updateStudySession(sessionId, {
      cardsStudied: session => session.cardsStudied + 1,
      cardsCorrect: session => isCorrect ? session.cardsCorrect + 1 : session.cardsCorrect,
    })

    if (session) {
      // Update the deck's last studied time
      await this.deckRepository.updateLastStudied(session.deckId)
    }
  }

  // Get all due cards for a study session
  async getDueCardsForStudy(deckId: UniqueId, limit: number = 20) {
    return this.cardRepository.getDueCards(deckId, limit)
  }

  // Apply review result to a card
  private async reviewCard(reviewData: ReviewCardDTO): Promise<void> {
    const card = await this.cardRepository.getCardById(reviewData.id)
    if (!card)
      return

    const updatedCard = await this.cardRepository.reviewCard(reviewData)

    if (updatedCard) {
      // Update card counts for the deck
      const counts = await this.cardRepository.getCardCountsByStatus(updatedCard.deckId)
      await this.deckRepository.updateDeckCardCounts(updatedCard.deckId, {
        cardCount: counts.total,
        newCount: counts.new,
        reviewCount: counts.review,
        learningCount: counts.learning + counts.relearning,
      })
    }
  }

  // Get study statistics for a user
  async getUserStats(userId: UniqueId): Promise<StudyStats> {
    return this.studySessionRepository.getStudyStatsByUser(userId)
  }

  // Get all study sessions for a deck
  async getStudySessionsByDeck(deckId: UniqueId): Promise<StudySession[]> {
    return this.studySessionRepository.getStudySessionsByDeck(deckId)
  }

  // Get all study sessions for a user
  async getUserStudySessions(userId: UniqueId): Promise<StudySession[]> {
    return this.studySessionRepository.getStudySessionsByUser(userId)
  }
}
