import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { Deck } from '@/decks/domain'
import type { CreateDeckUseCase } from '@/decks/application'
import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'

import { CreateDeckDto } from '@/decks/domain'
import { queryClient } from '@/core/presentation/react'
import { handleFormErrors } from '@/core/presentation/ui'

export const DECK_CREATE_DIALOG_KEY = 'deck-create-dialog'

export class CreateDialog {
  key: string = DECK_CREATE_DIALOG_KEY
  createDeck = new MobxMutation<Deck, CreateDeckDto, NetError>({
    queryClient,
    mutationFn: data => this.createDeckUseCase.execute(data),
    onSuccess: () => {
    },
    onError: (error) => {
      handleFormErrors(this.createDeckForm, error, this.notify, {
        focusFirstError: true,
      })
    },
  })

  createDeckForm: MobxForm<CreateDeckDto>

  constructor(
    private createDeckUseCase: CreateDeckUseCase,
    private notify: NotifyPort,
  ) {
    makeAutoObservable(this)

    this.createDeckForm = new MobxForm<CreateDeckDto>({
      defaultValues: {
        name: '',
        description: '',
      },
      resolver: classValidatorResolver(CreateDeckDto),
      mode: 'onChange',
      onSubmit: this._createDeck,
    })
  }

  private _createDeck = (data: CreateDeckDto) => {
    this.createDeck.mutate(data)
  }
}
