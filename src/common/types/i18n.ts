import type { TFunction } from 'i18next'

/**
 * Порт для работы с интернационализацией
 */
export interface I18n {
  t: TFunction
  changeLanguage: (lang: string) => Promise<void>
  getCurrentLanguage: () => string
  getAvailableLanguages: () => string[]
  onLanguageChanged: (callback: (lang: string) => void) => void
}
