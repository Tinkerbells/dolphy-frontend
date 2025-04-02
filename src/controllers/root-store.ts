import { injectable } from 'inversify'

import type { DeckStore } from './deck-store'
import type { CardStore } from './card-store'
import type { StudyStore } from './study-store'

@injectable()
export class RootStore {
  constructor(
    public deckStore: DeckStore,
    public cardStore: CardStore,
    public studyStore: StudyStore,
  ) {}
}
