// src/di/container.ts

import 'reflect-metadata'
import { Container } from 'inversify'

import type { TelegramService } from '../services/telegram-service'
import type { NotificationService } from '../services/notification-service'

// Symbols for DI
import { SYMBOLS } from './symbols'
// Controllers (MobX Stores)
import { DeckStore } from '../controllers/deck-store'
import { CardStore } from '../controllers/card-store'
// Services
import { DeckService } from '../services/deck-service'
import { CardService } from '../services/card-service'
// Repositories
import { DeckRepository } from '../repositories/deck-repository'
import { CardRepository } from '../repositories/card-repository'
import { TelegramMiniAppService } from '../services/telegram-service'
import { StudySessionStore } from '../controllers/study-session-store'
import { StudySessionService } from '../services/study-session-service'
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
container.bind<CardService>(SYMBOLS.CardService).to(CardService).inSingletonScope()
container.bind<StudySessionService>(SYMBOLS.StudySessionService).to(StudySessionService).inSingletonScope()

// Register MobX stores
container.bind<DeckStore>(SYMBOLS.DeckStore).to(DeckStore).inSingletonScope()
container.bind<CardStore>(SYMBOLS.CardStore).to(CardStore).inSingletonScope()
container.bind<StudySessionStore>(SYMBOLS.StudySessionStore).to(StudySessionStore).inSingletonScope()

export { container }
