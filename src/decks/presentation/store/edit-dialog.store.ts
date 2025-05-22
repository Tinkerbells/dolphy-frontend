import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { MobxMutation } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { Deck } from '@/decks/domain'
import type { UpdateDeckUseCase } from '@/decks/application'
import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'

import { UpdateDeckDto } from '@/decks/domain'
import { queryClient } from '@/core/presentation/react'
import { handleFormErrors } from '@/core/presentation/ui'

export const DECK_EDIT_DIALOG_KEY = 'deck-edit-dialog'

export class EditDialog {
  key: string = DECK_EDIT_DIALOG_KEY
  deckId: string | null
  updateDeck = new MobxMutation<Deck, { id: string, data: UpdateDeckDto }, NetError>({
    queryClient,
    mutationFn: ({ id, data }) => this.updateDeckUseCase.execute({ id, data }),
    onSuccess: () => {
      this.notify.success('Колода успешно обновлена')
    },
    onError: (error) => {
      handleFormErrors(this.editDeckForm, error, this.notify, {
        focusFirstError: true,
      })
    },
  })

  editDeckForm: MobxForm<UpdateDeckDto>

  constructor(
    private updateDeckUseCase: UpdateDeckUseCase,
    private notify: NotifyPort,
    deckId: string | null,
  ) {
    this.deckId = deckId
    this.editDeckForm = new MobxForm<UpdateDeckDto>({
      defaultValues: {
        name: '',
        description: '',
      },
      resolver: classValidatorResolver(UpdateDeckDto),
      mode: 'onChange',
      onSubmit: this._updateDeck,
    })

    makeAutoObservable(this)
  }

  private _updateDeck = (data: UpdateDeckDto) => {
    if (!this.deckId)
      return
    this.updateDeck.mutate({ id: this.deckId, data })
  }
}
