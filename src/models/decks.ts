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
    return this.decks.filter(deck =>
      deck.title.toLowerCase().includes(search.toLowerCase())
      || deck.description.toLowerCase().includes(search.toLowerCase()),
    )
  }
}
