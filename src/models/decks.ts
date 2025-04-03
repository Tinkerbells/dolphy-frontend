export type DeckTitle = string
export type DeckDescription = string

export interface DeckDto {
  id: UniqueId
  title: DeckTitle
  description: DeckDescription
  created: DateTimeString
  lastStudied?: DateTimeString
  owner: UniqueId // User ID
  tags: string[]
  cardCount: number
  newCount: number
  reviewCount: number
  learningCount: number
}

export class Deck implements DeckDto {
  id: UniqueId
  title: DeckTitle
  description: DeckDescription
  created: DateTimeString
  lastStudied?: DateTimeString
  owner: UniqueId
  tags: string[]
  cardCount: number
  newCount: number
  reviewCount: number
  learningCount: number

  constructor(deckDto: DeckDto) {
    this.id = deckDto.id
    this.title = deckDto.title
    this.description = deckDto.description
    this.created = deckDto.created
    this.lastStudied = deckDto.lastStudied
    this.owner = deckDto.owner
    this.tags = [...deckDto.tags]
    this.cardCount = deckDto.cardCount
    this.newCount = deckDto.newCount
    this.reviewCount = deckDto.reviewCount
    this.learningCount = deckDto.learningCount
  }

  get hasDueCards(): boolean {
    return this.newCount > 0 || this.reviewCount > 0 || this.learningCount > 0
  }

  get completionPercentage(): number {
    if (this.cardCount === 0)
      return 100
    const dueCards = this.newCount + this.reviewCount + this.learningCount
    return Math.round(((this.cardCount - dueCards) / this.cardCount) * 100)
  }

  update(updates: Partial<DeckDto>): void {
    Object.assign(this, updates)
  }

  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag)
    }
  }

  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag)
  }

  markAsStudied(): void {
    this.lastStudied = new Date().toISOString()
  }

  resetCounts(newCount = 0, reviewCount = 0, learningCount = 0): void {
    this.newCount = newCount
    this.reviewCount = reviewCount
    this.learningCount = learningCount
  }

  hasTag(tag: string): boolean {
    return this.tags.includes(tag)
  }

  toDto(): DeckDto {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      created: this.created,
      lastStudied: this.lastStudied,
      owner: this.owner,
      tags: [...this.tags],
      cardCount: this.cardCount,
      newCount: this.newCount,
      reviewCount: this.reviewCount,
      learningCount: this.learningCount,
    }
  }
}

export class Decks {
  decks: DeckDto[] = []
  constructor(decks: DeckDto[] = []) {
    this.decks = decks
  }

  get deckCount() {
    return this.decks.length
  }

  get hasDecks(): boolean {
    return this.decks.length > 0
  }

  selectDeck(deckId: string) {
    return this.decks.find(deck => deck.id === deckId)
  }

  filterByTag(tag: string) {
    if (!tag.trim())
      return this.decks
    return this.decks.filter(deck =>
      deck.tags.includes(tag),
    )
  }

  // Get all unique tags across all decks
  get allTags(): string[] {
    const tagsSet = new Set<string>()
    this.decks.forEach((deck) => {
      deck.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }

  // Get decks with cards due for review
  getDueDecks(): DeckDto[] {
    return this.decks.filter(deck =>
      deck.newCount > 0 || deck.reviewCount > 0 || deck.learningCount > 0,
    )
  }

  // Get decks sorted by last studied date (most recent first)
  getRecentlyStudiedDecks(): DeckDto[] {
    return [...this.decks]
      .filter(deck => deck.lastStudied)
      .sort((a, b) => {
        const dateA = a.lastStudied ? new Date(a.lastStudied).getTime() : 0
        const dateB = b.lastStudied ? new Date(b.lastStudied).getTime() : 0
        return dateB - dateA
      })
  }
}
