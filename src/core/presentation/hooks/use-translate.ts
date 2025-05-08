import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

import type { I18nPort } from '@/core/domain/ports/i18n.port'

import { I18nPortToken } from '@/core/domain/ports/i18n.port'

import { useInjected } from '../react'

export function useTranslate(ns?: string | string[]) {
  const { t, i18n } = useTranslation(ns)
  const i18nService = useInjected<I18nPort>(I18nPortToken)

  const changeLanguage = useCallback(async (lang: string): Promise<void> => {
    await i18nService.changeLanguage(lang)
  }, [i18nService])

  const getCurrentLanguage = useCallback((): string => {
    return i18nService.getCurrentLanguage()
  }, [i18nService])

  const getAvailableLanguages = useCallback((): string[] => {
    return i18nService.getAvailableLanguages()
  }, [i18nService])

  return {
    t,
    changeLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    i18n,
  }
}
