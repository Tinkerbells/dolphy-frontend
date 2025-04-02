import { inject, injectable } from 'inversify'
import { makeObservable, runInAction } from 'mobx'

import { Decks } from '@/models/decks'

import type { Deck } from '../domain/deck'
import type { DeckService } from '../services/deck-service'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class DeckStore {
  decks: Decks = new Decks()
  selectedDeck?: Deck
  isLoading = false
  error?: string

  constructor(
    @inject(SYMBOLS.DeckService) private deckService: DeckService,
    @inject(SYMBOLS.NotificationService) private notifier: NotificationService,
  ) {
    makeObservable(this)
  }

  get deckCount(): number {
    return this.decks.deckCount
  }

  get hasDecks(): boolean {
    return this.decks.hasDecks
  }

  async loadDecks() {
    this.isLoading = true
    this.error = undefined

    try {
      const decks = await this.deckService.getAllDecks()
      runInAction(() => {
        this.decks.setDecks(decks)
        this.isLoading = false
      })
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to load decks'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
    }
  }

  async createDeck(title: string, description: string, tags: string[] = []) {
    this.isLoading = true
    this.error = undefined

    try {
      const deck = await this.deckService.createDeck(title, description, tags)
      runInAction(() => {
        this.isLoading = false
        this.notifier.notify(`Deck "${title}" created successfully`)
      })
      return deck
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to create deck'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return undefined
    }
  }

  selectDeck(deckId: string) {
    this.selectedDeck = this.decks.selectDeck(deckId)
  }

  async updateDeck(deck: Deck) {
    this.isLoading = true
    this.error = undefined

    try {
      await this.deckService.updateDeck(deck)
      runInAction(() => {
        this.isLoading = false
        this.notifier.notify('Deck updated successfully')
      })
      return true
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to update deck'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return false
    }
  }

  async deleteDeck(deckId: string) {
    this.isLoading = true
    this.error = undefined

    try {
      await this.deckService.deleteDeck(deckId)
      runInAction(() => {
        if (this.selectedDeck?.id === deckId) {
          this.selectedDeck = undefined
        }
        this.isLoading = false
        this.notifier.notify('Deck deleted successfully')
      })
      return true
    }
    catch (error) {
      runInAction(() => {
        this.error = error instanceof Error ? error.message : 'Failed to delete deck'
        this.isLoading = false
        this.notifier.notify(this.error)
      })
      return false
    }
  }
}
