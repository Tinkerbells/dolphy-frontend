import type { MobxMutation } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { NetError } from '@/common/services/http-client'

import type { Deck } from '../models/deck.domain'

import { CreateDeckDto } from '../models/dto'

export class DecksCreateFormController {
  createDeckForm: MobxForm<CreateDeckDto>

  constructor(
    private readonly createDeckMutation: MobxMutation<Deck, CreateDeckDto, NetError>,
  ) {
    makeAutoObservable(this)

    this.createDeckForm = new MobxForm<CreateDeckDto>({
      defaultValues: {
        name: '',
        description: '',
      },
      resolver: classValidatorResolver(CreateDeckDto),
      mode: 'onChange',
      onSubmit: this.createDeck,
    })
  }

  private createDeck = (data: CreateDeckDto) => {
    this.createDeckMutation.mutate(data)
    this.createDeckForm.reset()
  }
}
