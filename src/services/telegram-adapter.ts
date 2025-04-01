import {
  hideBackButton,
  retrieveLaunchParams,
  onBackButtonClick as tgOnBackButtonClick,
  openLink as tgOpenLink,
  showBackButton as tgShowBackButton,
} from '@telegram-apps/sdk-react'

// src/services/telegramAdapter.ts
import type { TelegramService } from '../application/ports'

// Telegram Adapter
export function useTelegram(): TelegramService {
  // Get launch params for user info
  const launchParams = retrieveLaunchParams()

  return {
    getUserId(): UniqueId {
      try {
        // Try to get from launch params
        if (launchParams.tgWebAppData && launchParams.tgWebAppData.user) {
          return launchParams.tgWebAppData.user.id.toString()
        }

        // Fallback for development
        return 'demo-user'
      }
      catch (error) {
        console.error('Error getting user ID:', error)
        return 'demo-user'
      }
    },

    getUserName(): string {
      try {
        // Try to get from launch params
        if (launchParams.tgWebAppData && launchParams.tgWebAppData.user) {
          const { first_name, last_name } = launchParams.tgWebAppData.user
          return `${first_name || ''} ${last_name || ''}`.trim()
        }

        // Fallback for development
        return 'Demo User'
      }
      catch (error) {
        console.error('Error getting user name:', error)
        return 'Demo User'
      }
    },

    // setPageTitle(title: string): void {
    //   setPageTitle(title)
    // },

    showBackButton(show: boolean): void {
      if (show) {
        tgShowBackButton()
      }
      else {
        hideBackButton()
      }
    },

    onBackButtonClick(callback: () => void): () => void {
      return tgOnBackButtonClick(callback)
    },

    openLink(url: string): void {
      tgOpenLink(url)
    },
  }
}
