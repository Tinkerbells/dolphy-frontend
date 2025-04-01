import type { StudyDeckService } from '../application/study-deck'
import type { CreateCardService } from '../application/create-card'
import type { CreateDeckService } from '../application/create-deck'
import type {
  CardStorageService,
  DeckStorageService,
  NotificationService,
  StudySessionStorageService,
  TelegramService,
  UserStorageService,
} from '../application/ports'

import { SYMBOLS } from './symbols'
// src/di/hooks.ts
import { useService } from './provider'

// Hook to easily access notification service
export function useDINotifier(): NotificationService {
  return useService<NotificationService>(SYMBOLS.NotificationService)
}

// Hook to easily access telegram service
export function useDITelegram(): TelegramService {
  return useService<TelegramService>(SYMBOLS.TelegramService)
}

// Hook to easily access storage services
export function useDIUserStorage(): UserStorageService {
  return useService<UserStorageService>(SYMBOLS.UserStorageService)
}

export function useDIDecksStorage(): DeckStorageService {
  return useService<DeckStorageService>(SYMBOLS.DeckStorageService)
}

export function useDICardsStorage(): CardStorageService {
  return useService<CardStorageService>(SYMBOLS.CardStorageService)
}

export function useDIStudySessionStorage(): StudySessionStorageService {
  return useService<StudySessionStorageService>(SYMBOLS.StudySessionStorageService)
}

// Hook to easily access application services
export function useDICreateCard(): CreateCardService {
  return useService<CreateCardService>(SYMBOLS.CreateCardService)
}

export function useDICreateDeck(): CreateDeckService {
  return useService<CreateDeckService>(SYMBOLS.CreateDeckService)
}

export function useDIStudyDeck(): StudyDeckService {
  return useService<StudyDeckService>(SYMBOLS.StudyDeckService)
}
