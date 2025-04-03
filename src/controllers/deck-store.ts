// src/controllers/enhanced-deck-store.ts

import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { DeckDto } from '../models/decks'
import type { DeckService } from '../services/deck-service'
import type { TelegramService } from '../services/telegram-service'
import type { NotificationService } from '../services/notification-service'

import { SYMBOLS } from '../di/symbols'
import { Decks } from '../models/decks'

@injectable()
export class DeckStore {
  currentDeckId: string | null = null

  private decksQuery: MobxQuery<Decks, Error>
  private deckByIdQuery: MobxQuery<DeckDto | null, Error>
  private createDeckMutation: MobxMutation<DeckDto, { title: string, description: string }, Error>
  private updateDeckMutation: MobxMutation<DeckDto | null, { id: string, updates: Partial<DeckDto> }, Error>
  private deleteDeckMutation: MobxMutation<boolean, string, Error>

  constructor(
    @inject(SYMBOLS.DeckService) private deckService: DeckService,
    @inject(SYMBOLS.TelegramService) private telegramService: TelegramService,
    @inject(SYMBOLS.NotificationService) private notificationService: NotificationService,
    @inject(SYMBOLS.QueryClient) private queryClient: MobxQueryClient,
  ) {
    makeAutoObservable(this)

    // Initialize queries and mutations
    const userId = this.telegramService.getUserId()

    // Query for all decks
    this.decksQuery = new MobxQuery({
      queryClient,
      queryKey: ['decks', userId],
      queryFn: () => this.deckService.getDecks(userId),
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: true,
    })

    // Query for a single deck by ID
    this.deckByIdQuery = new MobxQuery({
      queryClient,
      queryKey: ['deck', ''],
      queryFn: async ({ queryKey }) => {
        const deckId = queryKey[1]
        if (!deckId)
          return null
        return this.deckService.getDeckById(deckId)
      },
      enabled: false, // Disabled by default until we have a deck ID
    })

    // Mutation for creating a new deck
    this.createDeckMutation = new MobxMutation({
      queryClient,
      mutationFn: async ({ title, description }) => {
        return this.deckService.createDeck(userId, title, description)
      },
      onSuccess: (newDeck) => {
        // Update the decks query cache with the new deck
        this.queryClient.setQueryData(['decks', userId], (oldData: Decks | undefined) => {
          if (!oldData)
            return new Decks([newDeck])
          return new Decks([...oldData.decks, newDeck])
        })
        this.notificationService.notify('Deck created successfully')
      },
      onError: () => {
        this.notificationService.notify('Failed to create deck')
      },
    })

    // Mutation for updating a deck
    this.updateDeckMutation = new MobxMutation({
      queryClient,
      mutationFn: async ({ id, updates }) => {
        return this.deckService.updateDeck(id, updates)
      },
      onSuccess: (updatedDeck) => {
        if (!updatedDeck)
          return

        this.queryClient.setQueryData(['decks', userId], (oldData: Decks | undefined) => {
          if (!oldData)
            return new Decks()
          return new Decks(oldData.decks.map(deck =>
            deck.id === updatedDeck.id ? updatedDeck : deck,
          ))
        })

        this.queryClient.setQueryData(['deck', updatedDeck.id], updatedDeck)

        this.notificationService.notify('Deck updated successfully')
      },
      onError: () => {
        this.notificationService.notify('Failed to update deck')
      },
    })

    // Mutation for deleting a deck
    this.deleteDeckMutation = new MobxMutation({
      queryClient,
      mutationFn: async (deckId) => {
        return this.deckService.deleteDeck(deckId)
      },
      onSuccess: (success, deckId) => {
        if (!success)
          return

        // Update the decks query cache to remove the deleted deck
        this.queryClient.setQueryData(['decks', userId], (oldData: Decks | undefined) => {
          if (!oldData)
            return new Decks()
          return new Decks(oldData.decks.filter(deck => deck.id !== deckId))
        })

        // Remove the single deck from cache
        this.queryClient.removeQueries({
          queryKey: ['deck', deckId],
        })

        // Reset current deck ID if it's the deleted deck
        if (this.currentDeckId === deckId) {
          this.setCurrentDeckId(null)
        }

        this.notificationService.notify('Deck deleted successfully')
      },
      onError: () => {
        this.notificationService.notify('Failed to delete deck')
      },
    })
  }

  // Actions
  setCurrentDeckId(deckId: string | null) {
    this.currentDeckId = deckId

    if (deckId) {
      // Update the query key and enable the query
      this.deckByIdQuery.update({
        queryKey: ['deck', deckId],
        enabled: true,
      })
    }
    else {
      // Disable the query when no deck is selected
      this.deckByIdQuery.update({
        enabled: false,
      })
    }
  }

  // Public methods for components
  async loadDecks() {
    return this.decksQuery.refetch()
  }

  async loadDeck(deckId: string) {
    this.setCurrentDeckId(deckId)
    const result = await this.deckByIdQuery.refetch()
    return result.data
  }

  async createDeck(title: string, description: string) {
    try {
      return await this.createDeckMutation.mutate({ title, description })
    }
    catch (error) {
      console.error('Failed to create deck:', error)
      return null
    }
  }

  async updateDeck(id: string, updates: Partial<Pick<DeckDto, 'title' | 'description' | 'tags'>>) {
    try {
      const result = await this.updateDeckMutation.mutate({ id, updates })
      return !!result
    }
    catch (error) {
      console.error('Failed to update deck:', error)
      return false
    }
  }

  async deleteDeck(id: string) {
    try {
      return await this.deleteDeckMutation.mutate(id)
    }
    catch (error) {
      console.error('Failed to delete deck:', error)
      return false
    }
  }

  filter(query: string) {
    const decks = this.decks.decks || []
    if (!query.trim())
      return decks

    return decks.filter(deck =>
      deck.title.toLowerCase().includes(query.toLowerCase())
      || deck.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

  // Computed getters
  get decks() {
    return this.decksQuery.result.data || new Decks()
  }

  get currentDeck() {
    return this.deckByIdQuery.result.data
  }

  get isLoading() {
    return (
      this.decksQuery.result.isLoading
      || this.deckByIdQuery.result.isLoading
      || this.createDeckMutation.result.isPending
      || this.updateDeckMutation.result.isPending
      || this.deleteDeckMutation.result.isPending
    )
  }

  get isFetching() {
    return this.decksQuery.result.isFetching || this.deckByIdQuery.result.isFetching
  }
}
