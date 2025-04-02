import 'reflect-metadata'
import { Container } from 'inversify'

import type { TelegramService } from '../services/telegram-service'
// Services
import type { NotificationService } from '../services/notification-service'

// Symbols for DI
import { SYMBOLS } from './symbols'
// Controllers (MobX Stores)
import { DeckStore } from '../controllers/deck-store'
import { DeckService } from '../services/deck-service'
import { StudyStore } from '../controllers/study-store'
import { StudyService } from '../services/study-service'
// Repositories
import { DeckRepository } from '../repositories/deck-repository'
import { CardRepository } from '../repositories/card-repository'
import { TelegramMiniAppService } from '../services/telegram-service'
import { MantineNotificationService } from '../services/notification-service'
import { StudySessionRepository } from '../repositories/study-session-repository'

// Create and configure the container
const container = new Container()

// Register repositories
container.bind<DeckRepository>(SYMBOLS.DeckRepository).to(DeckRepository).inSingletonScope()
container.bind<CardRepository>(SYMBOLS.CardRepository).to(CardRepository).inSingletonScope()
container.bind<StudySessionRepository>(SYMBOLS.StudySessionRepository).to(StudySessionRepository).inSingletonScope()

// Register services
container.bind<NotificationService>(SYMBOLS.NotificationService).to(MantineNotificationService).inSingletonScope()
container.bind<TelegramService>(SYMBOLS.TelegramService).to(TelegramMiniAppService).inSingletonScope()
container.bind<DeckService>(SYMBOLS.DeckService).to(DeckService).inSingletonScope()
container.bind<StudyService>(SYMBOLS.StudyService).to(StudyService).inSingletonScope()

// Register MobX stores
container.bind<DeckStore>(SYMBOLS.DeckStore).to(DeckStore).inSingletonScope()
container.bind<StudyStore>(SYMBOLS.StudyStore).to(StudyStore).inSingletonScope()

export { container }
