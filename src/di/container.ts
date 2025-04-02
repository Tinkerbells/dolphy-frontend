// src/di/container.ts
import 'reflect-metadata'
import { Container } from 'inversify'

// Interfaces
import type {
  CardStorageService,
  DeckStorageService,
  NotificationService,
  StudySessionStorageService,
  TelegramService,
  UserStorageService,
} from '../application/ports'

import { SYMBOLS } from './symbols'
// Service implementations
import { AppStore } from '../services/store'
import { StudyDeckService } from '../application/study-deck'
// Application services
import { CreateCardService } from '../application/create-card'
import { CreateDeckService } from '../application/create-deck'
import { TelegramService as TelegramServiceImpl } from '../services/telegram-adapter'
import { MantineNotificationService as NotificationServiceImpl } from '../services/notification-adapter'
import { CardStorageService as CardStorageServiceImpl, DeckStorageService as DeckStorageServiceImpl, StudySessionStorageService as StudySessionStorageServiceImpl, UserStorageService as UserStorageServiceImpl } from '../services/storage-adapter'

// Create and configure the container
const container = new Container()

// Регистрируем AppStore как singleton
container.bind<AppStore>(SYMBOLS.AppStore).to(AppStore).inSingletonScope()

// Регистрируем сервисы
container.bind<NotificationService>(SYMBOLS.NotificationService).to(NotificationServiceImpl)
container.bind<TelegramService>(SYMBOLS.TelegramService).to(TelegramServiceImpl)

// Используем фабрики для создания сервисов с зависимостями
container.bind<UserStorageService>(SYMBOLS.UserStorageService).toDynamicValue((context) => {
  const store = context.get<AppStore>(SYMBOLS.AppStore)
  return new UserStorageServiceImpl(store)
}).inSingletonScope()

container.bind<DeckStorageService>(SYMBOLS.DeckStorageService).toDynamicValue((context) => {
  const store = context.get<AppStore>(SYMBOLS.AppStore)
  return new DeckStorageServiceImpl(store)
}).inSingletonScope()

container.bind<CardStorageService>(SYMBOLS.CardStorageService).toDynamicValue((context) => {
  const store = context.get<AppStore>(SYMBOLS.AppStore)
  return new CardStorageServiceImpl(store)
}).inSingletonScope()

container.bind<StudySessionStorageService>(SYMBOLS.StudySessionStorageService).toDynamicValue((context) => {
  const store = context.get<AppStore>(SYMBOLS.AppStore)
  return new StudySessionStorageServiceImpl(store)
}).inSingletonScope()

// Регистрируем application сервисы с их зависимостями
container.bind<CreateCardService>(SYMBOLS.CreateCardService).toDynamicValue((context) => {
  const cardStorage = context.get<CardStorageService>(SYMBOLS.CardStorageService)
  const deckStorage = context.get<DeckStorageService>(SYMBOLS.DeckStorageService)
  const notifier = context.get<NotificationService>(SYMBOLS.NotificationService)
  return new CreateCardService(cardStorage, deckStorage, notifier)
}).inSingletonScope()

container.bind<CreateDeckService>(SYMBOLS.CreateDeckService).toDynamicValue((context) => {
  const deckStorage = context.get<DeckStorageService>(SYMBOLS.DeckStorageService)
  const userStorage = context.get<UserStorageService>(SYMBOLS.UserStorageService)
  const notifier = context.get<NotificationService>(SYMBOLS.NotificationService)
  return new CreateDeckService(deckStorage, userStorage, notifier)
}).inSingletonScope()

container.bind<StudyDeckService>(SYMBOLS.StudyDeckService).toDynamicValue((context) => {
  const cardStorage = context.get<CardStorageService>(SYMBOLS.CardStorageService)
  const deckStorage = context.get<DeckStorageService>(SYMBOLS.DeckStorageService)
  const sessionStorage = context.get<StudySessionStorageService>(SYMBOLS.StudySessionStorageService)
  const userStorage = context.get<UserStorageService>(SYMBOLS.UserStorageService)
  const notifier = context.get<NotificationService>(SYMBOLS.NotificationService)
  return new StudyDeckService(cardStorage, deckStorage, sessionStorage, userStorage, notifier)
}).inSingletonScope()

export { container }
