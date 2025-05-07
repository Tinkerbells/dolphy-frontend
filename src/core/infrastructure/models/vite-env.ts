import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator'

import { EnvironmentMode } from '@/core/domain/enums/env.enum'

/**
 * Конфигурация переменных окружения для Vite с декораторами валидации
 *
 * Примечание: В Vite переменные окружения доступны в вашем коде через import.meta.env
 * и должны иметь префикс VITE_, чтобы быть доступными в клиентском коде
 */
export class ViteEnvironmentVariables {
  @IsEnum(EnvironmentMode)
  @IsNotEmpty()
  MODE: EnvironmentMode

  @IsBoolean()
  @IsNotEmpty()
  PROD: boolean

  @IsBoolean()
  @IsNotEmpty()
  DEV: boolean

  @IsString()
  @IsNotEmpty()
  VITE_API_URL: string

  @IsString()
  @IsNotEmpty()
  VITE_APP_TITLE: string

  @IsBoolean()
  @IsOptional()
  VITE_ENABLE_ANALYTICS?: boolean

  @IsString()
  @IsOptional()
  VITE_OPTIONAL_FEATURE?: string
}
