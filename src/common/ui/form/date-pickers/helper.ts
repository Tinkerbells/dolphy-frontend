import { ru } from 'date-fns/locale/ru'
import { enUS } from 'date-fns/locale/en-US'

export function getValueByKey(language: string) {
  switch (language) {
    case 'en':
      return enUS
    case 'ru':
      return ru
    default:
      return enUS
  }
}
