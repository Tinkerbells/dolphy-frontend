export const SYMBOLS = {
  // Core

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  DeckRepository: Symbol.for('DeckRepository'),
  CardRepository: Symbol.for('CardRepository'),
  StudySessionRepository: Symbol.for('StudySessionRepository'),

  // Services
  NotificationService: Symbol.for('NotificationService'),
  StudySessionService: Symbol.for('StudySessionService'),
  TelegramService: Symbol.for('TelegramService'),
  UserService: Symbol.for('UserService'),
  DeckService: Symbol.for('DeckService'),
  CardService: Symbol.for('CardService'),
  StudyService: Symbol.for('StudyService'),

  // Controllers (MobX Stores)
  DeckStore: Symbol.for('DeckStore'),
  CardStore: Symbol.for('CardStore'),
  StudySessionStore: Symbol.for('StudySessionStore'),
  RootStore: Symbol.for('RootStore'),
}
