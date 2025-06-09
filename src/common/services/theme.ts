import { makeAutoObservable } from 'mobx'

import type { PersistStorage } from './local-storage'

import { localStorageInstance } from './local-storage'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface ThemeService {
  mode: ThemeMode
  effectiveMode: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggleMode: () => void
}

class ThemeStore implements ThemeService {
  private readonly THEME_MODE_KEY = 'theme-mode'
  private _mode: ThemeMode = 'system'

  constructor(
    private readonly persistStorage: PersistStorage,
  ) {
    makeAutoObservable(this)
    this.loadFromStorage()
    this.watchSystemTheme()
  }

  get mode(): ThemeMode {
    return this._mode
  }

  setMode(mode: ThemeMode): void {
    this._mode = mode
    this.saveToStorage()
  }

  toggleMode(): void {
    const modes: ThemeMode[] = ['light', 'dark', 'system']
    const currentIndex = modes.indexOf(this._mode)
    const nextIndex = (currentIndex + 1) % modes.length
    this.setMode(modes[nextIndex])
  }

  get effectiveMode(): 'light' | 'dark' {
    if (this._mode === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return this._mode
  }

  private loadFromStorage(): void {
    const saved = this.persistStorage.getAsString(this.THEME_MODE_KEY)
    if (saved && ['light', 'dark', 'system'].includes(saved)) {
      this._mode = saved as ThemeMode
    }
  }

  private saveToStorage(): void {
    this.persistStorage.setPrimitive(this.THEME_MODE_KEY, this._mode)
  }

  private watchSystemTheme(): void {
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', () => {
        // Trigger reactivity for system theme changes
        if (this._mode === 'system') {
          // Force observable change notification
          this.setMode('system')
        }
      })
    }
  }
}

export { ThemeStore }

export const themeService = new ThemeStore(localStorageInstance)
