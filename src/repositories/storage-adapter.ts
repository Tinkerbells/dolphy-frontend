import { injectable } from 'inversify'

import type { Card } from '../domain/card'
import type { Deck } from '../domain/deck'
import type { User } from '../domain/user'
import type { StudySession } from '../domain/study'

import { LOCAL_CARDS, LOCAL_DECKS } from '../services/fake-data'

@injectable()
export class StorageAdapter {
  // User methods
  async getUser(): Promise<User | undefined> {
    try {
      const userJson = localStorage.getItem('flashcards-user')
      return userJson ? JSON.parse(userJson) : undefined
    }
    catch (error) {
      console.error('Error getting user from localStorage:', error)
      return undefined
    }
  }

  async setUser(user: User): Promise<void> {
    try {
      localStorage.setItem('flashcards-user', JSON.stringify(user))
    }
    catch (error) {
      console.error('Error saving user to localStorage:', error)
    }
  }

  // Deck methods
  async getDecks(): Promise<Deck[]> {
    try {
      const decksJson = localStorage.getItem('flashcards-decks')
      return decksJson ? JSON.parse(decksJson) : LOCAL_DECKS
    }
    catch (error) {
      console.error('Error getting decks from localStorage:', error)
      return LOCAL_DECKS
    }
  }

  async setDecks(decks: Deck[]): Promise<void> {
    try {
      localStorage.setItem('flashcards-decks', JSON.stringify(decks))
    }
    catch (error) {
      console.error('Error saving decks to localStorage:', error)
    }
  }

  // Card methods
  async getCards(): Promise<Card[]> {
    try {
      const cardsJson = localStorage.getItem('flashcards-cards')
      return cardsJson ? JSON.parse(cardsJson) : LOCAL_CARDS
    }
    catch (error) {
      console.error('Error getting cards from localStorage:', error)
      return LOCAL_CARDS
    }
  }

  async setCards(cards: Card[]): Promise<void> {
    try {
      localStorage.setItem('flashcards-cards', JSON.stringify(cards))
    }
    catch (error) {
      console.error('Error saving cards to localStorage:', error)
    }
  }

  // Session methods
  async getSessions(): Promise<StudySession[]> {
    try {
      const sessionsJson = localStorage.getItem('flashcards-sessions')
      return sessionsJson ? JSON.parse(sessionsJson) : []
    }
    catch (error) {
      console.error('Error getting sessions from localStorage:', error)
      return []
    }
  }

  async setSessions(sessions: StudySession[]): Promise<void> {
    try {
      localStorage.setItem('flashcards-sessions', JSON.stringify(sessions))
    }
    catch (error) {
      console.error('Error saving sessions to localStorage:', error)
    }
  }

  async getCurrentSession(): Promise<StudySession | undefined> {
    try {
      const sessionJson = localStorage.getItem('flashcards-current-session')
      return sessionJson ? JSON.parse(sessionJson) : undefined
    }
    catch (error) {
      console.error('Error getting current session from localStorage:', error)
      return undefined
    }
  }

  async setCurrentSession(session?: StudySession): Promise<void> {
    try {
      if (session) {
        localStorage.setItem('flashcards-current-session', JSON.stringify(session))
      }
      else {
        localStorage.removeItem('flashcards-current-session')
      }
    }
    catch (error) {
      console.error('Error saving current session to localStorage:', error)
    }
  }

  // Utils
  async clearAll(): Promise<void> {
    try {
      localStorage.removeItem('flashcards-user')
      localStorage.removeItem('flashcards-decks')
      localStorage.removeItem('flashcards-cards')
      localStorage.removeItem('flashcards-sessions')
      localStorage.removeItem('flashcards-current-session')
    }
    catch (error) {
      console.error('Error clearing localStorage:', error)
    }
  }
}
