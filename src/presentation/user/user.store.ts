import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { Injectable } from '@wox-team/wox-inject'

import type { User } from '@/domain/user/user.domain'
import type { NotificationService } from '@/application/services/notification.service'

import { localStorage } from '@/utils/local-storage'

/**
 * Хранилище данных о текущем пользователе
 */
@Injectable()
export class UserStore {
  /** Данные текущего пользователя */
  currentUser: User | null = null

  /** Флаг аутентификации пользователя */
  isAuthenticated = false

  /** Флаг загрузки данных */
  isLoading = false

  /**
   * Создает экземпляр хранилища пользователя
   *
   * @param {MobxQueryClient} queryClient - Клиент запросов
   * @param {NotificationService} notificationService - Сервис уведомлений
   */
  constructor(
    private queryClient: MobxQueryClient,
    private notificationService: NotificationService,
  ) {
    makeAutoObservable(this)
    this.checkAuth()
  }

  /**
   * Устанавливает данные пользователя
   *
   * @param {User | null} user - Данные пользователя
   */
  setUser(user: User | null) {
    this.currentUser = user
    this.isAuthenticated = !!user
  }

  /**
   * Устанавливает флаг загрузки
   *
   * @param {boolean} loading - Флаг загрузки
   */
  setLoading(loading: boolean) {
    this.isLoading = loading
  }

  /**
   * Проверяет аутентификацию пользователя
   */
  async checkAuth() {
    const token = localStorage.get('access_token')
    if (!token) {
      this.setUser(null)
    }
  }

  /**
   * Выходит из системы (удаляет токены и данные пользователя)
   */
  logout() {
    localStorage.remove('access_token')
    localStorage.remove('refresh_token')
    this.setUser(null)
    this.notificationService.info('Вы вышли из системы')
  }
}
