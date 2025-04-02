import { inject, injectable } from 'inversify'

import type { DeckRepository } from '../repositories/deck-repository'

import { SYMBOLS } from '../di/symbols'

@injectable()
export class DeckService {
  constructor(
    @inject(SYMBOLS.DeckRepository) private deckRepository: DeckRepository,
  ) {}
}
