// Card domain model
export type CardFront = string
export type CardBack = string

export interface CardDto {
  id: UniqueId
  deckId: UniqueId
  front: CardFront
  back: CardBack
  created: DateTimeString
  lastReviewed?: DateTimeString
  difficulty: DifficultyLevel
  status: StudyStatus
  dueDate?: DateTimeString
  notes?: string
  tags: string[]
}

export class Cards {
  cards: CardDto[] = []

  setCards(cards: CardDto[]) {
    this.cards = cards
  }

  get cardCount(): number {
    return this.cards.length
  }

  selectCard(cardId: string): CardDto | undefined {
    return this.cards.find(card => card.id === cardId)
  }

  getCardsByDeck(deckId: string): CardDto[] {
    return this.cards.filter(card => card.deckId === deckId)
  }

  getCardsDueForDeck(deckId: string): CardDto[] {
    const now = new Date().toISOString()
    return this.cards.filter(card =>
      card.deckId === deckId
      && (card.status === 'new' || !card.dueDate || card.dueDate <= now),
    )
  }

  getDueCountsByStatus(deckId: string): { new: number, learning: number, review: number, relearning: number } {
    const now = new Date().toISOString()
    const dueCards = this.cards.filter(card =>
      card.deckId === deckId
      && (!card.dueDate || card.dueDate <= now),
    )

    return {
      new: dueCards.filter(card => card.status === 'new').length,
      learning: dueCards.filter(card => card.status === 'learning').length,
      review: dueCards.filter(card => card.status === 'review').length,
      relearning: dueCards.filter(card => card.status === 'relearning').length,
    }
  }

  filter(search: string): CardDto[] {
    return this.cards.filter(card =>
      card.front.toLowerCase().includes(search.toLowerCase())
      || card.back.toLowerCase().includes(search.toLowerCase()),
    )
  }
}
