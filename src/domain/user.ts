// src/domain/user.ts
export type UserName = string

export interface StudyPreferences {
  newCardsPerDay: number
  reviewsPerDay: number
  defaultDeckId?: UniqueId
  showRemainingCards: boolean
  showTimer: boolean
  darkMode: boolean
}

export interface User {
  id: UniqueId // Telegram user ID
  name: UserName
  preferences: StudyPreferences
  lastUsed?: DateTimeString
}

export const DEFAULT_PREFERENCES: StudyPreferences = {
  newCardsPerDay: 20,
  reviewsPerDay: 100,
  showRemainingCards: true,
  showTimer: true,
  darkMode: false,
}

export function createUser(id: UniqueId, name: UserName): User {
  return {
    id,
    name,
    preferences: DEFAULT_PREFERENCES,
  }
}

export function updateUserPreferences(
  user: User,
  preferences: Partial<StudyPreferences>,
): User {
  return {
    ...user,
    preferences: {
      ...user.preferences,
      ...preferences,
    },
  }
}

export function updateUserLastUsed(user: User, timestamp: DateTimeString): User {
  return {
    ...user,
    lastUsed: timestamp,
  }
}
