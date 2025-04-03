export const SYMBOLS = {
  // Repositories
  DeckRepository: Symbol.for('DeckRepository'),

  // Services
  NotificationService: Symbol.for('NotificationService'),
  TelegramService: Symbol.for('TelegramService'),
  UserService: Symbol.for('UserService'),
  DeckService: Symbol.for('DeckService'),

  // Controllers (MobX Stores)
  DeckStore: Symbol.for('DeckStore'),
}
