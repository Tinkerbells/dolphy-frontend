import type { Mutation } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { NetError } from '@/common/services/http-client'

import type { Card } from '../models'

import { CreateCardDto } from '../models/dto/create-card.dto'

export class CardsCreateFormController {
  createCardForm: MobxForm<CreateCardDto>

  constructor(
    private readonly createCardMutation: Mutation<Card, CreateCardDto, NetError>,
  ) {
    makeAutoObservable(this)

    this.createCardForm = new MobxForm<CreateCardDto>({
      defaultValues: {
        question: '',
        answer: '',
        source: 'manual',
        deckId: '',
        metadata: {
          tags: [],
          filename: '',
          sourceId: '',
        },
      },
      resolver: classValidatorResolver(CreateCardDto),
      mode: 'onChange',
      reValidateMode: 'onChange',
      onSubmit: this.createCard,
    })
  }

  private createCard = async (data: CreateCardDto): Promise<void> => {
    await this.createCardMutation.mutate(data)
  }
}
