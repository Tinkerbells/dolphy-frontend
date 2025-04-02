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

export class Decks {
  decks: DeckDto[] = []

  constructor(decks: DeckDto[] = []) {
    this.decks = decks
  }

  setDecks(decks: DeckDto[]) {
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

  filter(search: string) {
    if (!search.trim())
      return this.decks

    const normalizedSearch = search.toLowerCase().trim()
    return this.decks.filter(deck =>
      deck.title.toLowerCase().includes(normalizedSearch)
      || deck.description.toLowerCase().includes(normalizedSearch)
      || deck.tags.some(tag => tag.toLowerCase().includes(normalizedSearch)),
    )
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
