export const I18nPortToken = Symbol('I18nPort')

/**
 * Порт для работы с интернационализацией
 */
export interface I18nPort {
  t: (key: string) => string
  changeLanguage: (lang: string) => Promise<void>
  getCurrentLanguage: () => string
  getAvailableLanguages: () => string[]
  onLanguageChanged: (callback: (lang: string) => void) => void
}
