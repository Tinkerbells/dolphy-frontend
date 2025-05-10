export const Locales = {
  English: 'en',
  Russian: 'ru',
} as const

export type LocaleKey = keyof typeof Locales
