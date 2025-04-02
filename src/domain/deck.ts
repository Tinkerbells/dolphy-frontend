// Domain model for Deck entity
export interface Deck {
  id: UniqueId
  title: string
  description: string
  created: DateTimeString
  lastStudied?: DateTimeString
  owner: UniqueId
  tags: string[]
  cardCount: number
  newCount: number
  reviewCount: number
  learningCount: number
}

// Value object for creating a new deck
export interface CreateDeckDTO {
  title: string
  description: string
  tags: string[]
  owner: UniqueId
}

// Value object for updating a deck
export interface UpdateDeckDTO {
  id: UniqueId
  title?: string
  description?: string
  tags?: string[]
}
