import { inject, injectable } from 'inversiland'

import type { UseCase } from '@/core/application/use-case'
import type { CreateDeckDto, Deck, IDeckRepository } from '@/decks/domain'

@injectable()
export class CreateDeckUseCase implements UseCase<CreateDeckDto, Promise<Deck>> {
  constructor(
    @inject('IDeckRepository') private readonly deckRepository: IDeckRepository,
  ) {}

  public execute(data: CreateDeckDto): Promise<Deck> {
    return this.deckRepository.create(data)
  }
}
