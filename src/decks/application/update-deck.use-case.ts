import { inject, injectable } from 'inversiland'

import type { UseCase } from '@/core/application/use-case'
import type { Deck, IDeckRepository, UpdateDeckDto } from '@/decks/domain'

interface UpdateDeckPayload {
  id: string
  data: UpdateDeckDto
}

@injectable()
export class UpdateDeckUseCase implements UseCase<UpdateDeckPayload, Promise<Deck>> {
  constructor(
    @inject('IDeckRepository') private readonly deckRepository: IDeckRepository,
  ) {}

  public execute({ id, data }: UpdateDeckPayload): Promise<Deck> {
    return this.deckRepository.update(id, data)
  }
}
