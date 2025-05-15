import { inject, injectable } from 'inversiland'

import type { UseCase } from '@/core/application/use-case'
import type { Deck, IDeckRepository } from '@/decks/domain'

@injectable()
export class GetDeckByIdUseCase implements UseCase<string, Promise<Deck>> {
  constructor(
    @inject('IDeckRepository') private readonly deckRepository: IDeckRepository,
  ) {}

  public execute(id: string): Promise<Deck> {
    return this.deckRepository.findById(id)
  }
}
