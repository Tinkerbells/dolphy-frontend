// src/services/telegram-adapter.ts
import { injectable } from 'inversify'
import {
  hideBackButton,
  retrieveLaunchParams,
  onBackButtonClick as tgOnBackButtonClick,
  openLink as tgOpenLink,
  showBackButton as tgShowBackButton,
} from '@telegram-apps/sdk-react'

import type { TelegramService as TelegramServiceInterface } from '../application/ports'

@injectable()
export class TelegramService implements TelegramServiceInterface {
  private launchParams = retrieveLaunchParams()

  getUserId(): UniqueId {
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

// Keep the old hook for backward compatibility during transition
export function useTelegram(): TelegramService {
  return new TelegramService()
}
