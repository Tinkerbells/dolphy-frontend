import { inject, injectable } from 'inversify'

import type { DeckRepository, FindAllDecksDto } from '@/domain'

import { Symbols } from '@/di'

@injectable()
export class Decks {
  constructor(
    @inject(Symbols.DeckRepository) private deckRepository: DeckRepository,
  ) {}

  async getAll(): Promise<FindAllDecksDto> {
    return await this.deckRepository.findAll()
  }
}
