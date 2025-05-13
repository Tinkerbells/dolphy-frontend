import type { TFunction } from 'i18next'

import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { inject, injectable } from 'inversiland'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import type { EnvPort } from '@/core/domain/ports/env.port'
import type { I18nPort } from '@/core/domain/ports/i18n.port'

import { Locales } from '@/core/domain/enums/locales.enum'
import { EnvPortToken } from '@/core/domain/ports/env.port'

import type { ViteEnvironmentVariables } from '../models/vite-env'

export const I18nStorageKey = 'i18n_language'
/**
 * Адаптер для работы с i18next
 */
@injectable()
export class I18nAdapter implements I18nPort {
  private languageChangedCallbacks: Array<(lang: string) => void> = []

  constructor(
    @inject(EnvPortToken) private readonly env: EnvPort<ViteEnvironmentVariables>,
  ) { }

  /**
   * Инициализирует i18next
   */
  public async init(): Promise<void> {
    await i18n
      .use(Backend)
      .use(LanguageDetector)
      .use(initReactI18next)
      .init({
        cleanCode: true,
        load: 'languageOnly',
        fallbackLng: this.getAvailableLanguages(),
        ns: ['common', 'auth', 'validation', 'decks', 'cards', 'notes'],
        defaultNS: 'common',
        debug: this.env.isDevelopment(),
        interpolation: {
          escapeValue: false,
        },
        detection: {
          order: ['localStorage', 'navigator'],
          lookupLocalStorage: I18nStorageKey,
        },
        // TODO поправить проблему suspense в useTranslation
        react: {
          useSuspense: false,
        },
        backend: {
          loadPath: '/locales/{{lng}}/{{ns}}.json',
        },
      })

    i18n.on('languageChanged', (lang: string) => {
      this.notifyLanguageChanged(lang)
      localStorage.setItem(I18nStorageKey, lang)
    })
  }

  public t: TFunction = i18n.t.bind(i18n)

  public async changeLanguage(lang: string): Promise<void> {
    await i18n.changeLanguage(lang)
  }

  public getCurrentLanguage(): string {
    return i18n.language
  }

  public getAvailableLanguages(): string[] {
    return Object.values(Locales)
  }

  public onLanguageChanged(callback: (lang: string) => void): void {
    this.languageChangedCallbacks.push(callback)
  }

  private notifyLanguageChanged(lang: string): void {
    this.languageChangedCallbacks.forEach(callback => callback(lang))
  }
}
