// src/services/store.ts
import { injectable } from 'inversify'
import { makeAutoObservable } from 'mobx'
import React, { createContext, useContext, useState } from 'react'

import type { Card } from '../domain/card'
import type { Deck } from '../domain/deck'
import type { User } from '../domain/user'
import type { StudySession } from '../domain/study'

import { LOCAL_DECKS } from './fake-data'

@injectable()
export class AppStore {
  user?: User = undefined
  decks: Deck[] = []
  cards: Card[] = []
  sessions: StudySession[] = []
  currentSession?: StudySession = undefined

  constructor() {
    makeAutoObservable(this)
    this.loadFromLocalStorage()
  }

  // User methods
  setUser(user: User) {
    this.user = user
    this.saveToLocalStorage()
  }

  updateUser(user: User) {
    this.user = user
    this.saveToLocalStorage()
  }

  // Deck methods
  setDecks(decks: Deck[]) {
    this.decks = decks
    this.saveToLocalStorage()
  }

  addDeck(deck: Deck) {
    this.decks.push(deck)
    this.saveToLocalStorage()
  }

  updateDeck(deck: Deck) {
    const index = this.decks.findIndex(d => d.id === deck.id)
    if (index !== -1) {
      this.decks[index] = deck
      this.saveToLocalStorage()
    }
  }

  removeDeck(deckId: UniqueId) {
    this.decks = this.decks.filter(deck => deck.id !== deckId)
    // Also remove related cards
    this.cards = this.cards.filter(card => card.deckId !== deckId)
    this.saveToLocalStorage()
  }

  // Card methods
  setCards(cards: Card[]) {
    this.cards = cards
    this.saveToLocalStorage()
  }

  addCard(card: Card) {
    this.cards.push(card)
    this.saveToLocalStorage()
  }

  updateCard(card: Card) {
    const index = this.cards.findIndex(c => c.id === card.id)
    if (index !== -1) {
      this.cards[index] = card
      this.saveToLocalStorage()
    }
  }

  removeCard(cardId: UniqueId) {
    this.cards = this.cards.filter(card => card.id !== cardId)
    this.saveToLocalStorage()
  }

  // Study session methods
  setSessions(sessions: StudySession[]) {
    this.sessions = sessions
    this.saveToLocalStorage()
  }

  addSession(session: StudySession) {
    this.sessions.push(session)
    this.saveToLocalStorage()
  }

  updateSession(session: StudySession) {
    const index = this.sessions.findIndex(s => s.id === session.id)
    if (index !== -1) {
      this.sessions[index] = session
      this.saveToLocalStorage()
    }
  }

  setCurrentSession(session?: StudySession) {
    this.currentSession = session
    this.saveToLocalStorage()
  }

  // Local storage methods
  saveToLocalStorage() {
    try {
      localStorage.setItem('flashcards-user', JSON.stringify(this.user))
      localStorage.setItem('flashcards-decks', JSON.stringify(this.decks))
      localStorage.setItem('flashcards-cards', JSON.stringify(this.cards))
      localStorage.setItem('flashcards-sessions', JSON.stringify(this.sessions))
      localStorage.setItem('flashcards-current-session', JSON.stringify(this.currentSession))
    }
    catch (error) {
      console.error('Error saving to localStorage:', error)
    }
  }

  loadFromLocalStorage() {
    try {
      // Load user
      const userJson = localStorage.getItem('flashcards-user')
      if (userJson)
        this.user = JSON.parse(userJson)

      // Load decks or use test data if none exist
      const decksJson = localStorage.getItem('flashcards-decks')
      this.decks = decksJson ? JSON.parse(decksJson) : LOCAL_DECKS

      // Load cards
      const cardsJson = localStorage.getItem('flashcards-cards')
      if (cardsJson)
        this.cards = JSON.parse(cardsJson)

      // Load sessions
      const sessionsJson = localStorage.getItem('flashcards-sessions')
      if (sessionsJson)
        this.sessions = JSON.parse(sessionsJson)

      // Load current session
      const currentSessionJson = localStorage.getItem('flashcards-current-session')
      if (currentSessionJson)
        this.currentSession = JSON.parse(currentSessionJson)
    }
    catch (error) {
      console.error('Error loading from localStorage:', error)
      this.decks = LOCAL_DECKS // Use test data if loading fails
    }
  }

  // Reset store (for testing purposes)
  resetStore() {
    this.user = undefined
    this.decks = []
    this.cards = []
    this.sessions = []
    this.currentSession = undefined
    localStorage.removeItem('flashcards-user')
    localStorage.removeItem('flashcards-decks')
    localStorage.removeItem('flashcards-cards')
    localStorage.removeItem('flashcards-sessions')
    localStorage.removeItem('flashcards-current-session')
  }
}

// Create the store context
const StoreContext = createContext<AppStore | null>(null)

// Provider component
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [store] = useState(() => new AppStore())

  return (
    <StoreContext.Provider value={store}>
      {children}
    </StoreContext.Provider>
  )
}

// Custom hook to use the store
export function useStore() {
  const store = useContext(StoreContext)
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return store
}
