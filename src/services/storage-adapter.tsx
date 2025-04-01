import type {
  CardStorageService,
  DeckStorageService,
  StudySessionStorageService,
  UserStorageService,
} from '../application/ports'

import { useStore } from './store'

export function useUserStorage(): UserStorageService {
  const store = useStore()

  return {
    get user() {
      return store.user
    },

    updateUser(user) {
      store.updateUser(user)
    },
  }
}

export function useDecksStorage(): DeckStorageService {
  const store = useStore()

  return {
    get decks() {
      return store.decks
    },

    getDeck(id) {
      return store.decks.find(deck => deck.id === id)
    },

    createDeck(deck) {
      store.addDeck(deck)
    },

    updateDeck(deck) {
      store.updateDeck(deck)
    },

    deleteDeck(id) {
      store.removeDeck(id)
    },
  }
}

// Card Storage Adapter
export function useCardsStorage(): CardStorageService {
  const store = useStore()

  return {
    get cards() {
      return store.cards
    },

    getCardsByDeck(deckId) {
      return store.cards.filter(card => card.deckId === deckId)
    },

    getCard(id) {
      return store.cards.find(card => card.id === id)
    },

    createCard(card) {
      store.addCard(card)
    },

    updateCard(card) {
      store.updateCard(card)
    },

    deleteCard(id) {
      store.removeCard(id)
    },

    bulkUpdateCards(cards) {
      cards.forEach(card => store.updateCard(card))
    },
  }
}

export function useStudySessionStorage(): StudySessionStorageService {
  const store = useStore()

  return {
    get sessions() {
      return store.sessions
    },

    get currentSession() {
      return store.currentSession
    },

    getSession(id) {
      return store.sessions.find(session => session.id === id)
    },

    getSessionsByDeck(deckId) {
      return store.sessions.filter(session => session.deckId === deckId)
    },

    createSession(session) {
      store.addSession(session)
    },

    updateSession(session) {
      store.updateSession(session)
    },

    setCurrentSession(session) {
      store.setCurrentSession(session)
    },
  }
}
