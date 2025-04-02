export const SYMBOLS = {
  // Core
  StorageAdapter: Symbol.for('StorageAdapter'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  DeckRepository: Symbol.for('DeckRepository'),
  CardRepository: Symbol.for('CardRepository'),
  StudySessionRepository: Symbol.for('StudySessionRepository'),

  // Services
  NotificationService: Symbol.for('NotificationService'),
  TelegramService: Symbol.for('TelegramService'),
  UserService: Symbol.for('UserService'),
  DeckService: Symbol.for('DeckService'),
  CardService: Symbol.for('CardService'),
  StudyService: Symbol.for('StudyService'),

  // Controllers (MobX Stores)
  DeckStore: Symbol.for('DeckStore'),
  CardStore: Symbol.for('CardStore'),
  StudyStore: Symbol.for('StudyStore'),
  RootStore: Symbol.for('RootStore'),
}
