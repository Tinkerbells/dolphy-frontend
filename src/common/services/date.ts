import type { Locale } from 'date-fns'

import { format } from 'date-fns'
import { ru } from 'date-fns/locale/ru'
import { enUS } from 'date-fns/locale/en-US'

export class DateFormatter {
  private locale: Locale = enUS

  private _getLocale(locale?: string): Locale {
    switch (locale) {
      case 'en':
        return enUS
      case 'ru':
        return ru
      default:
        return this.locale
    }
  }

  // ISO 8601 format (most universal) - YYYY-MM-DD
  public formatDate(date: Date, locale?: string): string {
    return format(date, 'yyyy-MM-dd', { locale: this._getLocale(locale) })
  }

  // ISO 8601 with time - YYYY-MM-DD HH:mm:ss
  public formatDateTime(date: Date, locale?: string): string {
    return format(date, 'yyyy-MM-dd HH:mm:ss', { locale: this._getLocale(locale) })
  }

  // ISO 8601 with milliseconds and timezone
  public formatDateTimeISO(date: Date, locale?: string): string {
    return format(date, 'yyyy-MM-dd\'T\'HH:mm:ss.SSSxxx', { locale: this._getLocale(locale) })
  }

  // Human readable format
  public formatDateHuman(date: Date, locale?: string): string {
    return format(date, 'dd MMM yyyy', { locale: this._getLocale(locale) })
  }

  // Human readable format with additional
  public formatDateTimeHuman(date: Date, locale?: string): string {
    return format(date, 'dd MMM yyyy HH:mm', { locale: this._getLocale(locale) })
  }

  // Short format
  public formatDateShort(date: Date, locale?: string): string {
    return format(date, 'dd/MM/yyyy', { locale: this._getLocale(locale) })
  }

  // Additional localized formats
  public formatDateLong(date: Date, locale?: string): string {
    return format(date, 'PPPP', { locale: this._getLocale(locale) })
  }

  public formatDateMedium(date: Date, locale?: string): string {
    return format(date, 'PPP', { locale: this._getLocale(locale) })
  }

  public formatTime(date: Date, locale?: string): string {
    return format(date, 'p', { locale: this._getLocale(locale) })
  }

  public formatDateTimeLocalized(date: Date, locale?: string): string {
    return format(date, 'Pp', { locale: this._getLocale(locale) })
  }

  // Custom format with locale
  public formatCustom(date: Date, formatString: string, locale?: string): string {
    return format(date, formatString, { locale: this._getLocale(locale) })
  }

  // Set default locale for the instance
  public setDefaultLocale(locale: string): void {
    this.locale = this._getLocale(locale)
  }
}
