export const SYMBOLS = {
  // Storage services
  UserStorageService: Symbol.for('UserStorageService'),
  DeckStorageService: Symbol.for('DeckStorageService'),
  CardStorageService: Symbol.for('CardStorageService'),
  StudySessionStorageService: Symbol.for('StudySessionStorageService'),

  // Other services
  NotificationService: Symbol.for('NotificationService'),
  TelegramService: Symbol.for('TelegramService'),
  ApiService: Symbol.for('ApiService'),

  // Application services
  CreateCardService: Symbol.for('CreateCardService'),
  CreateDeckService: Symbol.for('CreateDeckService'),
  StudyDeckService: Symbol.for('StudyDeckService'),

  // Store
  AppStore: Symbol.for('AppStore'),
}
