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

  public searchQuery: string = ''

  public isFormDrawerOpen: boolean = false

  public formData = {
    title: '',
    description: '',
  }

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

    const userId = this.telegramService.getUserId()

    this.decksQuery = new MobxQuery({
      queryClient,
      queryKey: ['decks', userId],
      queryFn: () => this.deckService.getDecks(userId),
      staleTime: 60 * 1000, // 1 minute
      refetchOnWindowFocus: true,
    })

    this.deckByIdQuery = new MobxQuery({
      queryClient,
      queryKey: ['deck', ''],
      queryFn: async ({ queryKey }) => {
        const deckId = queryKey[1]
        if (!deckId)
          return null
        return this.deckService.getDeckById(deckId)
      },
      enabled: false,
    })

    this.createDeckMutation = new MobxMutation({
      queryClient,
      mutationFn: async ({ title, description }) => {
        return this.deckService.createDeck(userId, title, description)
      },
      onSuccess: (newDeck) => {
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

    this.deleteDeckMutation = new MobxMutation({
      queryClient,
      mutationFn: async (deckId) => {
        return this.deckService.deleteDeck(deckId)
      },
      onSuccess: (success, deckId) => {
        if (!success)
          return

        this.queryClient.setQueryData(['decks', userId], (oldData: Decks | undefined) => {
          if (!oldData)
            return new Decks()
          return new Decks(oldData.decks.filter(deck => deck.id !== deckId))
        })

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

  setCurrentDeckId(deckId: string | null) {
    this.currentDeckId = deckId

    if (deckId) {
      this.deckByIdQuery.update({
        queryKey: ['deck', deckId],
        enabled: true,
      })
    }
    else {
      this.deckByIdQuery.update({
        enabled: false,
      })
    }
  }

  setSearchQuery(query: string) {
    this.searchQuery = query
  }

  clearSearchQuery() {
    this.searchQuery = ''
  }

  setFormTitle(title: string) {
    this.formData.title = title
  }

  setFormDescription(description: string) {
    this.formData.description = description
  }

  resetForm() {
    this.formData = {
      title: '',
      description: '',
    }
  }

  changeOpen(open: boolean) {
    this.isFormDrawerOpen = open
  }

  closeFormDrawer() {
    this.isFormDrawerOpen = false
    this.resetForm()
  }

  async submitDeckForm() {
    const { title, description } = this.formData
    const result = await this.createDeck(title, description)

    if (result) {
      this.resetForm()
      this.closeFormDrawer()
      return true
    }

    return false
  }

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

  filter(query: string = this.searchQuery) {
    const decks = this.decks.decks || []
    if (!query.trim())
      return decks

    return decks.filter(deck =>
      deck.title.toLowerCase().includes(query.toLowerCase())
      || deck.description.toLowerCase().includes(query.toLowerCase()),
    )
  }

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

  get filteredDecks() {
    return this.filter()
  }
}
