// src/services/storage-adapter.tsx
import { injectable } from 'inversify'

import type { Card } from '@/domain/card'
import type { Deck } from '@/domain/deck'
import type { User } from '@/domain/user'
import type { StudySession } from '@/domain/study'

import type { AppStore } from './store'
import type {
  CardStorageService as CardStorageServiceInterface,
  DeckStorageService as DeckStorageServiceInterface,
  StudySessionStorageService as StudySessionStorageServiceInterface,
  UserStorageService as UserStorageServiceInterface,
} from '../application/ports'

// Import this from the original location - this is just to make the transition hooks work
import { useStore } from './store'

@injectable()
export class UserStorageService implements UserStorageServiceInterface {
  private store: AppStore

  constructor(store: AppStore) {
    this.store = store
  }

  get user() {
    return this.store.user
  }

  updateUser(user: User): void {
    this.store.updateUser(user)
  }
}

@injectable()
export class DeckStorageService implements DeckStorageServiceInterface {
  private store: AppStore

  constructor(store: AppStore) {
    this.store = store
  }

  get decks() {
    return this.store.decks
  }

  getDeck(id: UniqueId): Deck | undefined {
    return this.store.decks.find(deck => deck.id === id)
  }

  createDeck(deck: Deck): void {
    this.store.addDeck(deck)
  }

  updateDeck(deck: Deck): void {
    this.store.updateDeck(deck)
  }

  deleteDeck(id: UniqueId): void {
    this.store.removeDeck(id)
  }
}

@injectable()
export class CardStorageService implements CardStorageServiceInterface {
  private store: AppStore

  constructor(store: AppStore) {
    this.store = store
  }

  get cards() {
    return this.store.cards
  }

  getCardsByDeck(deckId: UniqueId): Card[] {
    return this.store.cards.filter(card => card.deckId === deckId)
  }

  getCard(id: UniqueId): Card | undefined {
    return this.store.cards.find(card => card.id === id)
  }

  createCard(card: Card): void {
    this.store.addCard(card)
  }

  updateCard(card: Card): void {
    this.store.updateCard(card)
  }

  deleteCard(id: UniqueId): void {
    this.store.removeCard(id)
  }

  bulkUpdateCards(cards: Card[]): void {
    cards.forEach(card => this.store.updateCard(card))
  }
}

@injectable()
export class StudySessionStorageService implements StudySessionStorageServiceInterface {
  private store: AppStore

  constructor(store: AppStore) {
    this.store = store
  }

  get sessions() {
    return this.store.sessions
  }

  get currentSession() {
    return this.store.currentSession
  }

  getSession(id: UniqueId): StudySession | undefined {
    return this.store.sessions.find(session => session.id === id)
  }

  getSessionsByDeck(deckId: UniqueId): StudySession[] {
    return this.store.sessions.filter(session => session.deckId === deckId)
  }

  createSession(session: StudySession): void {
    this.store.addSession(session)
  }

  updateSession(session: StudySession): void {
    this.store.updateSession(session)
  }

  setCurrentSession(session?: StudySession): void {
    this.store.setCurrentSession(session)
  }
}

// Keep the old hooks for backward compatibility during transition
export function useUserStorage(): UserStorageServiceInterface {
  const store = useStore()
  return new UserStorageService(store)
}

export function useDecksStorage(): DeckStorageServiceInterface {
  const store = useStore()
  return new DeckStorageService(store)
}

export function useCardsStorage(): CardStorageServiceInterface {
  const store = useStore()
  return new CardStorageService(store)
}

export function useStudySessionStorage(): StudySessionStorageServiceInterface {
  const store = useStore()
  return new StudySessionStorageService(store)
}
