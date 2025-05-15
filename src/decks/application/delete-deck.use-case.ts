import { inject, injectable } from 'inversiland'

import type { IDeckRepository } from '@/decks/domain'
import type { UseCase } from '@/core/application/use-case'

@injectable()
export class DeleteDeckUseCase implements UseCase<string, Promise<void>> {
  constructor(
    @inject('IDeckRepository') private readonly deckRepository: IDeckRepository,
  ) {}

  public execute(id: string): Promise<void> {
    return this.deckRepository.remove(id)
  }
}
