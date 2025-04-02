import { injectable } from 'inversify'
import { createContext, useContext } from 'react'
import {
  hideBackButton,
  retrieveLaunchParams,
  onBackButtonClick as tgOnBackButtonClick,
  openLink as tgOpenLink,
  showBackButton as tgShowBackButton,
} from '@telegram-apps/sdk-react'

export interface TelegramService {
  getUserId: () => string
  getUserName: () => string
  showBackButton: (show: boolean) => void
  onBackButtonClick: (callback: () => void) => () => void
  openLink: (url: string) => void
}

@injectable()
export class TelegramMiniAppService implements TelegramService {
  private launchParams = retrieveLaunchParams()

  getUserId(): string {
    try {
      // Try to get from launch params
      if (this.launchParams.tgWebAppData && this.launchParams.tgWebAppData.user) {
        return this.launchParams.tgWebAppData.user.id.toString()
      }

      // Fallback for development
      return 'demo-user'
    }
    catch (error) {
      console.error('Error getting user ID:', error)
      return 'demo-user'
    }
  }

  getUserName(): string {
    try {
      // Try to get from launch params
      if (this.launchParams.tgWebAppData && this.launchParams.tgWebAppData.user) {
        const { first_name, last_name } = this.launchParams.tgWebAppData.user
        return `${first_name || ''} ${last_name || ''}`.trim()
      }

      // Fallback for development
      return 'Demo User'
    }
    catch (error) {
      console.error('Error getting user name:', error)
      return 'Demo User'
    }
  }

  showBackButton(show: boolean): void {
    if (show) {
      tgShowBackButton()
    }
    else {
      hideBackButton()
    }
  }

  onBackButtonClick(callback: () => void): () => void {
    return tgOnBackButtonClick(callback)
  }

  openLink(url: string): void {
    tgOpenLink(url)
  }
}

// Context for using Telegram service in components
const TelegramServiceContext = createContext<TelegramService | null>(null)

export const TelegramServiceProvider = TelegramServiceContext.Provider

export function useTelegramService() {
  const context = useContext(TelegramServiceContext)
  if (!context) {
    throw new Error('useTelegramService must be used within TelegramServiceProvider')
  }
  return context
}
