import type { Mutation } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { NetError } from '@/common/services/http-client'

import type { Deck } from '../models/deck.domain'

import { UpdateDeckDto } from '../models/dto'

export class DecksUpdateFormController {
  updateDeckForm: MobxForm<UpdateDeckDto>

  constructor(
    private readonly updateDeckMutation: Mutation<Deck, { id: Deck['id'], data: UpdateDeckDto }, NetError>,
    private readonly deck: Deck,
  ) {
    makeAutoObservable(this)

    this.updateDeckForm = new MobxForm<UpdateDeckDto>({
      defaultValues: {
        name: deck.name,
        description: deck.description,
      },
      resolver: classValidatorResolver(UpdateDeckDto),
      mode: 'onChange',
      onSubmit: this.updateDeck,
    })
  }

  private updateDeck = (data: UpdateDeckDto) => {
    const id = this.deck.id
    this.updateDeckMutation.mutate({ id, data })
  }
}
