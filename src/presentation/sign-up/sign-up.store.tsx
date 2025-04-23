import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { AuthService } from '@/application/services/auth.service'
import type { NotificationService } from '@/application/services/notification.service'

import { SYMBOLS } from '@/di/symbols'
import { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

/**
 * Хранилище состояния страницы регистрации
 */
@injectable()
export class SignUpStore {
  /** Мутация регистрации */
  register: MobxMutation<void, AuthRegisterLoginDto, Error>

  /** Форма регистрации */
  signUpForm: MobxForm<AuthRegisterLoginDto>

  /** Флаг отображения пароля */
  showPassword = false

  /**
   * Создает экземпляр хранилища регистрации
   *
   * @param {AuthService} authService - Сервис аутентификации
   * @param {NotificationService} notificationService - Сервис уведомлений
   * @param {MobxQueryClient} queryClient - Клиент запросов
   */
  constructor(
    @inject(SYMBOLS.AuthService) private authService: AuthService,
    @inject(SYMBOLS.NotificationService) private notificationService: NotificationService,
    @inject(SYMBOLS.QueryClient) private queryClient: MobxQueryClient,
  ) {
    // Инициализация мутации регистрации
    this.register = new MobxMutation({
      queryClient: this.queryClient,
      mutationFn: dto => this.authService.register(dto),
      onSuccess: () => {
        this.notificationService.success('Регистрация успешна', 'Пожалуйста, войдите в систему.')
      },
      onError: (error) => {
        this.notificationService.error('Ошибка регистрации', error.message)
      },
    })

    // Инициализация формы с использованием MobxForm
    this.signUpForm = new MobxForm<AuthRegisterLoginDto>({
      defaultValues: {
        email: '',
        password: '',
        firstName: '',
        lastName: '',
      },
      resolver: classValidatorResolver(AuthRegisterLoginDto),
      mode: 'onChange',
      onSubmit: this.handleSignUp,
    })

    makeAutoObservable(this)
  }

  /**
   * Обработчик отправки формы регистрации
   *
   * @param {AuthRegisterDto} data - Данные формы регистрации
   */
  handleSignUp = async (data: AuthRegisterLoginDto) => {
    try {
      await this.register.mutate(data)
    }
    catch (error) {
      console.error('Registration failed:', error)
    }
  }

  /**
   * Переключает видимость пароля
   */
  togglePasswordVisibility = () => {
    this.showPassword = !this.showPassword
  }
}
