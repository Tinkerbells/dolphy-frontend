// Domain model for Card entity
export interface Card {
  id: UniqueId
  front: string
  back: string
  tags: string[]
  deckId: UniqueId
  created: DateTimeString
  lastReviewed?: DateTimeString
  difficulty: DifficultyLevel
  status: StudyStatus
  lapses: number
  interval: number // Days until next review
  notes?: string
}

// Value object for creating a new card
export interface CreateCardDTO {
  front: string
  back: string
  tags: string[]
  deckId: UniqueId
  notes?: string
}

// Value object for updating a card
export interface UpdateCardDTO {
  id: UniqueId
  front?: string
  back?: string
  tags?: string[]
  notes?: string
}

// Value object for review action
export interface ReviewCardDTO {
  id: UniqueId
  performance: DifficultyLevel // How well the user remembered (0-5)
}
