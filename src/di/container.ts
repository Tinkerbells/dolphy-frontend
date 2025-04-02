import 'reflect-metadata'
import { Container } from 'inversify'

import type { TelegramService } from '../services/telegram-service'
// Services
import type { NotificationService } from '../services/notification-service'

// Interfaces and implementations
import { SYMBOLS } from './symbols'
// Controllers (MobX Stores)
import { DeckStore } from '../controllers/deck-store'
import { DeckService } from '../services/deck-service'
// Core
// Repositories
import { DeckRepository } from '../repositories/deck-repository'
import { TelegramMiniAppService } from '../services/telegram-service'
import { MantineNotificationService } from '../services/notification-service'

// Create and configure the container
const container = new Container()

// Register core dependencies

// Register repositories
container.bind<DeckRepository>(SYMBOLS.DeckRepository).to(DeckRepository).inSingletonScope()

// Register services
container.bind<NotificationService>(SYMBOLS.NotificationService).to(MantineNotificationService).inSingletonScope()
container.bind<TelegramService>(SYMBOLS.TelegramService).to(TelegramMiniAppService).inSingletonScope()
container.bind<DeckService>(SYMBOLS.DeckService).to(DeckService).inSingletonScope()

// Register MobX stores
container.bind<DeckStore>(SYMBOLS.DeckStore).to(DeckStore).inSingletonScope()

export { container }
