import { inject, injectable } from 'inversiland'

import type { PaginationResponseDto } from '@/types'
import type { UseCase } from '@/core/application/use-case'
import type { Deck, IDeckRepository } from '@/decks/domain'

@injectable()
export class GetDecksUseCase implements UseCase<void, Promise<PaginationResponseDto<Deck>>> {
  constructor(
   @inject('IDeckRepository') private readonly deckRepository: IDeckRepository,
  ) {}

  public execute(): Promise<PaginationResponseDto<Deck>> {
    return this.deckRepository.findAll()
  }
}
