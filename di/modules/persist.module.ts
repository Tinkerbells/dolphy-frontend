import { ContainerModule } from 'inversify'

import type { PersistPort } from '@/domain'

import { LocalStorageService } from '@/infrastructure'

import { Symbols } from '../symbols'

/**
 * Модуль для регистрации сервисов хранения в контейнере DI
 */
export const persistModule = new ContainerModule((options) => {
  // Регистрируем LocalStorageService как реализацию PersistPort
  options.bind<PersistPort>(Symbols.PersistService).to(LocalStorageService).inSingletonScope()
})
