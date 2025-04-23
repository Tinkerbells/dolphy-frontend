export const SYMBOLS = {
  // Core
  QueryClient: Symbol.for('QueryClient'),

  // Repositories
  UserRepository: Symbol.for('UserRepository'),
  DeckRepository: Symbol.for('DeckRepository'),
  CardRepository: Symbol.for('CardRepository'),
  StudySessionRepository: Symbol.for('StudySessionRepository'),
  AuthRepository: Symbol.for('AuthRepository'),

  // Services
  NotificationService: Symbol.for('NotificationService'),
  StudySessionService: Symbol.for('StudySessionService'),
  TelegramService: Symbol.for('TelegramService'),
  DeckService: Symbol.for('DeckService'),
  CardService: Symbol.for('CardService'),
  StudyService: Symbol.for('StudyService'),
  AuthService: Symbol.for('AuthService'),

  // Controllers (MobX Stores)
  DeckStore: Symbol.for('DeckStore'),
  CardStore: Symbol.for('CardStore'),
  StudySessionStore: Symbol.for('StudySessionStore'),
  RootStore: Symbol.for('RootStore'),
  SignInStore: Symbol.for('SignInStore'),
  SignUpStore: Symbol.for('SignUpStore'),
  UserStore: Symbol.for('UserStore'),
}
