import 'reflect-metadata'
import { Container } from 'inversify'

import type { TelegramService } from '../services/telegram-service'
// Services
import type { NotificationService } from '../services/notification-service'

// Interfaces and implementations
import { SYMBOLS } from './symbols'
// Controllers (MobX Stores)
import { DeckStore } from '../controllers/deck-store'
import { CardStore } from '../controllers/card-store'
import { RootStore } from '../controllers/root-store'
import { UserService } from '../services/user-service'
import { DeckService } from '../services/deck-service'
import { CardService } from '../services/card-service'
import { StudyStore } from '../controllers/study-store'
import { StudyService } from '../services/study-service'
// Core
import { StorageAdapter } from '../repositories/storage-adapter'
// Repositories
import { UserRepository } from '../repositories/user-repository'
import { DeckRepository } from '../repositories/deck-repository'
import { CardRepository } from '../repositories/card-repository'
import { TelegramMiniAppService } from '../services/telegram-service'
import { MantineNotificationService } from '../services/notification-service'
import { StudySessionRepository } from '../repositories/study-session-repository'

// Create and configure the container
const container = new Container()

// Register core dependencies
container.bind<StorageAdapter>(SYMBOLS.StorageAdapter).to(StorageAdapter).inSingletonScope()

// Register repositories
container.bind<UserRepository>(SYMBOLS.UserRepository).to(UserRepository).inSingletonScope()
container.bind<DeckRepository>(SYMBOLS.DeckRepository).to(DeckRepository).inSingletonScope()
container.bind<CardRepository>(SYMBOLS.CardRepository).to(CardRepository).inSingletonScope()
container.bind<StudySessionRepository>(SYMBOLS.StudySessionRepository).to(StudySessionRepository).inSingletonScope()

// Register services
container.bind<NotificationService>(SYMBOLS.NotificationService).to(MantineNotificationService).inSingletonScope()
container.bind<TelegramService>(SYMBOLS.TelegramService).to(TelegramMiniAppService).inSingletonScope()
container.bind<UserService>(SYMBOLS.UserService).to(UserService).inSingletonScope()
container.bind<DeckService>(SYMBOLS.DeckService).to(DeckService).inSingletonScope()
container.bind<CardService>(SYMBOLS.CardService).to(CardService).inSingletonScope()
container.bind<StudyService>(SYMBOLS.StudyService).to(StudyService).inSingletonScope()

// Register MobX stores
container.bind<DeckStore>(SYMBOLS.DeckStore).to(DeckStore).inSingletonScope()
container.bind<CardStore>(SYMBOLS.CardStore).to(CardStore).inSingletonScope()
container.bind<StudyStore>(SYMBOLS.StudyStore).to(StudyStore).inSingletonScope()

// Register root store
container.bind<RootStore>(SYMBOLS.RootStore).toDynamicValue((context) => {
  const deckStore = context.get<DeckStore>(SYMBOLS.DeckStore)
  const cardStore = context.get<CardStore>(SYMBOLS.CardStore)
  const studyStore = context.get<StudyStore>(SYMBOLS.StudyStore)

  return new RootStore(deckStore, cardStore, studyStore)
}).inSingletonScope()

export { container }
