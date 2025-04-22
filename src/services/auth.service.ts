// src/services/auth-service.ts
import { inject, injectable } from 'inversify'

import type { LoginResponseDto } from '@/models/auth/dto/auth.dto'

import { getCurrentDateTime } from '@/common/functions'

import type { UserDto } from '../models/user/user'
import type { UserRepository } from '../repositories/user.repository'

import { SYMBOLS } from '../di/symbols'

export interface AuthResponseDto {
  user: UserDto
  token: string
  tokenExpires: number
}

export interface RegisterUserDto {
  email: string
  password: string
  firstName?: string
  lastName?: string
}

@injectable()
export class AuthService {
  constructor(
    @inject(SYMBOLS.UserRepository) private userRepository: UserRepository,
  ) {}

  /**
   * Аутентификация пользователя
   */
  async login(email: string, password: string): Promise<LoginResponseDto> {
    // В реальном приложении здесь была бы проверка пароля с хешированием
    // Для демо просто проверяем, существует ли пользователь с таким email

    await new Promise(resolve => setTimeout(resolve, 500)) // Имитация задержки API

    const user = await this.userRepository.getUserByEmail(email)

    if (!user) {
      return null
    }

    // Обновляем время последнего входа
    await this.userRepository.updateLastLogin(user.id)

    // Генерируем демо-токен и время истечения (24 часа)
    const token = `demo_token_${Math.random().toString(36).substring(2)}`
    const tokenExpires = Date.now() + 24 * 60 * 60 * 1000

    return {
      user,
      token,
      tokenExpires,
    }
  }

  /**
   * Регистрация нового пользователя
   */
  async register(userData: RegisterUserDto): Promise<UserDto | null> {
    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await this.userRepository.getUserByEmail(userData.email)

    if (existingUser) {
      return null // Пользователь с таким email уже существует
    }

    // В реальном приложении здесь было бы хеширование пароля
    // Для демо просто создаем пользователя
    const newUser = await this.userRepository.createUser({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      lastLogin: getCurrentDateTime(),
    })

    return newUser
  }

  /**
   * Выход из системы
   */
  async logout(): Promise<boolean> {
    // В реальном приложении здесь был бы код для инвалидации токена
    await new Promise(resolve => setTimeout(resolve, 300)) // Имитация задержки API
    return true
  }

  /**
   * Проверка валидности токена
   */
  async verifyToken(token: string): Promise<UserDto | null> {
    // В реальном приложении здесь была бы проверка токена
    // Для демо предположим, что токен всегда действителен, если он начинается с "demo_token_"

    if (!token.startsWith('demo_token_')) {
      return null
    }

    // Имитируем получение ID пользователя из токена
    const userId = '1' // В реальном приложении это извлекалось бы из токена

    return this.userRepository.getUserById(userId)
  }
}
