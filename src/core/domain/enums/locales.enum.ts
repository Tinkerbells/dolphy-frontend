export const Locale = {
  English: 'en',
  Russian: 'ru',
} as const

export type LocaleKey = keyof typeof Locale
