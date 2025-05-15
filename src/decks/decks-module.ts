import { module } from 'inversiland'

import { DecksStore } from './presentation'
import { DeckRepository } from './infrastructure/adapters/deck.repository'
import {
  CreateDeckUseCase,
  DeleteDeckUseCase,
  GetDeckByIdUseCase,
  GetDecksUseCase,
  UpdateDeckUseCase,
} from './application'

@module({
  providers: [
    {
      provide: 'IDeckRepository',
      useClass: DeckRepository,
    },
    GetDecksUseCase,
    GetDeckByIdUseCase,
    CreateDeckUseCase,
    UpdateDeckUseCase,
    DeleteDeckUseCase,
    {
      isGlobal: true,
      useClass: DecksStore,
    },
  ],
})
export class DecksModule {}
