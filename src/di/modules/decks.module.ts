import { ContainerModule } from 'inversify'

import type { DeckRepository } from '@/domain'

import { Decks } from '@/application'
import { DeckNetRepository } from '@/infrastructure'
import { DecksStore } from '@/presentation/decks/decks.store'

import { Symbols } from '../symbols'

/**
 * Модуль для регистрации сервисов колод в контейнере DI
 */
export const decksModule = new ContainerModule((options) => {
  options.bind<DeckRepository>(Symbols.DeckRepository).to(DeckNetRepository).inSingletonScope()
  options.bind(Symbols.Decks).to(Decks).inSingletonScope()
  options.bind(Symbols.DecksStore).to(DecksStore).inSingletonScope()
})
