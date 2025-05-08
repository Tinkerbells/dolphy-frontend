import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { inject, injectable } from 'inversiland'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import type { EnvPort } from '@/core/domain/ports/env.port'
import type { I18nPort } from '@/core/domain/ports/i18n.port'

import { Locale } from '@/core/domain/enums/locales.enum'
import { EnvPortToken } from '@/core/domain/ports/env.port'

import type { ViteEnvironmentVariables } from '../models/vite-env'

/**
 * Адаптер для работы с i18next
 */
@injectable()
export class I18nAdapter implements I18nPort {
  private languageChangedCallbacks: Array<(lang: string) => void> = []

  constructor(
    @inject(EnvPortToken) private readonly env: EnvPort<ViteEnvironmentVariables>,
  ) {
    this.initI18n()
  }

  /**
   * Инициализирует i18next
   */
  private async initI18n(): Promise<void> {
    await i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        fallbackLng: 'en',
        ns: ['common', 'auth', 'validation', 'decks', 'cards', 'notes'],
        defaultNS: 'common',
        debug: this.env.isDevelopment(),
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          lookupLocalStorage: 'i18nextLng',
        },
        react: {
          useSuspense: true,
        },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      })

    i18n.on('languageChanged', (lang: string) => {
      this.notifyLanguageChanged(lang)
      localStorage.setItem('i18nextLng', lang)
    })
  }

  t(key: string): string {
    return i18n.t(key)
  }

  async changeLanguage(lang: string): Promise<void> {
    await i18n.changeLanguage(lang)
  }

  getCurrentLanguage(): string {
    return i18n.language
  }

  getAvailableLanguages(): string[] {
    return Object.values(Locale)
  }

  onLanguageChanged(callback: (lang: string) => void): void {
    this.languageChangedCallbacks.push(callback)
  }

  private notifyLanguageChanged(lang: string): void {
    this.languageChangedCallbacks.forEach(callback => callback(lang))
  }
}
