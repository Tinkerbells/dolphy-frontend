import type { TFunction } from 'i18next'

import i18n from 'i18next'
import Backend from 'i18next-http-backend'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import { Locales } from '@/types/enums/locales.enum'

import type { Env, I18n } from '../types'
import type { ViteEnvironmentVariables } from './env/vite-env'

import { env } from './env'

/**
 * Адаптер для работы с i18next
 */
class I18nService implements I18n {
  private readonly I18nStorageKey: string = 'i18n_language'
  private languageChangedCallbacks: Array<(lang: string) => void> = []

  constructor(private readonly env: Env<ViteEnvironmentVariables>) { }

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
          lookupLocalStorage: this.I18nStorageKey,
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
      localStorage.setItem(this.I18nStorageKey, lang)
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

export const i18nInstance = new I18nService(env)
