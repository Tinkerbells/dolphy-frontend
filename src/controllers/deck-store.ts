import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'

import type { DeckDto } from '../models/decks'
import type { DeckService } from '../services/deck-service'
import type { TelegramService } from '../services/telegram-service'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'
import { Decks } from '../models/decks'

@injectable()
export class DeckStore {
  decks = new Decks()
  isLoading = false
  currentDeckId: string | null = null

  constructor(
    @inject(SYMBOLS.DeckService) private deckService: DeckService,
    @inject(SYMBOLS.TelegramService) private telegramService: TelegramService,
    @inject(SYMBOLS.NotificationService) private notificationService: NotificationService,
  ) {
    makeAutoObservable(this)
  }

  async loadDecks(): Promise<void> {
    try {
      this.setLoading(true)
      const userId = this.telegramService.getUserId()
      this.decks = await this.deckService.getDecks(userId)
    }
    catch (error) {
      console.error('Failed to load decks:', error)
      this.notificationService.notify('Failed to load decks')
    }
    finally {
      this.setLoading(false)
    }
  }

  async createDeck(title: string, description: string): Promise<DeckDto | null> {
    try {
      this.setLoading(true)
      const userId = this.telegramService.getUserId()
      const newDeck = await this.deckService.createDeck(userId, title, description)

      // Update the local decks list
      await this.loadDecks()

      this.notificationService.notify('Deck created successfully')
      return newDeck
    }
    catch (error) {
      console.error('Failed to create deck:', error)
      this.notificationService.notify('Failed to create deck')
      return null
    }
    finally {
      this.setLoading(false)
    }
  }

  async updateDeck(deckId: string, updates: { title?: string, description?: string }): Promise<boolean> {
    try {
      this.setLoading(true)
      const updatedDeck = await this.deckService.updateDeck(deckId, updates)

      if (updatedDeck) {
        // Refresh decks to get the updated data
        await this.loadDecks()
        this.notificationService.notify('Deck updated successfully')
        return true
      }
      return false
    }
    catch (error) {
      console.error('Failed to update deck:', error)
      this.notificationService.notify('Failed to update deck')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async deleteDeck(deckId: string): Promise<boolean> {
    try {
      this.setLoading(true)
      const success = await this.deckService.deleteDeck(deckId)

      if (success) {
        // Refresh decks to get the updated list
        await this.loadDecks()

        // Clear currentDeckId if the deleted deck was selected
        if (this.currentDeckId === deckId) {
          this.setCurrentDeckId(null)
        }

        this.notificationService.notify('Deck deleted successfully')
      }
      return success
    }
    catch (error) {
      console.error('Failed to delete deck:', error)
      this.notificationService.notify('Failed to delete deck')
      return false
    }
    finally {
      this.setLoading(false)
    }
  }

  async searchDecks(query: string): Promise<DeckDto[]> {
    try {
      this.setLoading(true)
      const userId = this.telegramService.getUserId()
      const decks = await this.deckService.searchDecks(userId, query)
      return decks
    }
    catch (error) {
      console.error('Failed to search decks:', error)
      this.notificationService.notify('Failed to search decks')
      return []
    }
    finally {
      this.setLoading(false)
    }
  }

  filter(query: string) {
    return this.decks.decks.filter(deck =>
      deck.title.toLowerCase().includes(query.toLowerCase())
      || deck.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  async loadDeck(deckId: string): Promise<DeckDto | null> {
    try {
      this.setLoading(true)
      const deck = await this.deckService.getDeckById(deckId)

      if (deck) {
        this.setCurrentDeckId(deckId)
      }

      return deck
    }
    catch (error) {
      console.error('Failed to load deck:', error)
      this.notificationService.notify('Failed to load deck')
      return null
    }
    finally {
      this.setLoading(false)
    }
  }

  setLoading(isLoading: boolean): void {
    this.isLoading = isLoading
  }

  setCurrentDeckId(deckId: string | null): void {
    this.currentDeckId = deckId
  }

  get currentDeck(): DeckDto | undefined {
    if (!this.currentDeckId)
      return undefined
    return this.decks.selectDeck(this.currentDeckId)
  }
}
