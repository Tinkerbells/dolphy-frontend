// src/application/ports.ts
import type { Card } from '../domain/card'
import type { Deck } from '../domain/deck'
import type { User } from '../domain/user'
import type { StudySession } from '../domain/study'

// User storage service
export interface UserStorageService {
  user?: User
  updateUser: (user: User) => void
}

// Deck storage service
export interface DeckStorageService {
  decks: Deck[]
  getDeck: (id: UniqueId) => Deck | undefined
  createDeck: (deck: Deck) => void
  updateDeck: (deck: Deck) => void
  deleteDeck: (id: UniqueId) => void
}

// Card storage service
export interface CardStorageService {
  cards: Card[]
  getCardsByDeck: (deckId: UniqueId) => Card[]
  getCard: (id: UniqueId) => Card | undefined
  createCard: (card: Card) => void
  updateCard: (card: Card) => void
  deleteCard: (id: UniqueId) => void
  bulkUpdateCards: (cards: Card[]) => void
}

// Study session storage service
export interface StudySessionStorageService {
  sessions: StudySession[]
  currentSession?: StudySession
  getSession: (id: UniqueId) => StudySession | undefined
  getSessionsByDeck: (deckId: UniqueId) => StudySession[]
  createSession: (session: StudySession) => void
  updateSession: (session: StudySession) => void
  setCurrentSession: (session?: StudySession) => void
}

// Notification service
export interface NotificationService {
  notify: (message: string) => void
}

// Telegram service
export interface TelegramService {
  getUserId: () => UniqueId
  getUserName: () => string
  // setPageTitle: (title: string) => void
  showBackButton: (show: boolean) => void
  onBackButtonClick: (callback: () => void) => () => void
  openLink: (url: string) => void
}

// API service
export interface ApiService {
  syncDecks: () => Promise<void>
  syncCards: () => Promise<void>
  syncUser: () => Promise<void>
}
