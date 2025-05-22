import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversiland'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { Deck } from '@/decks/domain'
import type { PaginationResponseDto } from '@/types'
import type { ModalPort } from '@/core/domain/ports/modal.port'
import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'

import { queryClient } from '@/core/presentation/react'
import { ModalPortToken } from '@/core/domain/ports/modal.port'
import { NotifyPortToken } from '@/core/domain/ports/notify.port'
import {
  CreateDeckUseCase,
  DeleteDeckUseCase,
  GetDeckByIdUseCase,
  GetDecksUseCase,
  UpdateDeckUseCase,
} from '@/decks/application'

import { EditDialog } from './edit-dialog.store'
import { CreateDialog } from './create-dialog.store'

@injectable()
export class DecksStore {
  // Состояние UI
  isCreateDeckDialogOpen = false
  isEditDeckDialogOpen = false
  selectedDeckId: string | null = null

  createDialog: CreateDialog
  editDialog: EditDialog

  // Запросы
  decks = new MobxQuery<PaginationResponseDto<Deck>, NetError>({
    queryClient,
    queryKey: ['decks'],
    queryFn: () => this.getDecksUseCase.execute(),
  })

  selectedDeck = new MobxQuery<Deck, NetError>({
    queryClient,
    queryKey: ['deck', ''],
    queryFn: () => this.getDeckByIdUseCase.execute(''),
    enabled: false,
  })

  deleteDeck = new MobxMutation<void, string, NetError>({
    queryClient,
    mutationFn: id => this.deleteDeckUseCase.execute(id),
    onSuccess: () => {
      this.notify.success('Колода успешно удалена')
      this.decks.refetch()
    },
    onError: (error) => {
      this.notify.error(`Ошибка при удалении колоды: ${error.message}`)
    },
  })

  constructor(
    @inject(ModalPortToken) private modal: ModalPort,
    @inject(CreateDeckUseCase) private createDeckUseCase: CreateDeckUseCase,
    @inject(GetDecksUseCase) private getDecksUseCase: GetDecksUseCase,
    @inject(GetDeckByIdUseCase) private getDeckByIdUseCase: GetDeckByIdUseCase,
    @inject(UpdateDeckUseCase) private updateDeckUseCase: UpdateDeckUseCase,
    @inject(DeleteDeckUseCase) private deleteDeckUseCase: DeleteDeckUseCase,
    @inject(NotifyPortToken) private notify: NotifyPort,
  ) {
    this.createDialog = new CreateDialog(this.createDeckUseCase, this.notify)
    this.editDialog = new EditDialog(this.updateDeckUseCase, this.notify, this.selectedDeckId)
    makeAutoObservable(this)
  }

  handleDeleteDeck = (id: string) => {
    this.deleteDeck.mutate(id)
  }

  // // Получение колоды по ID для редактирования
  // fetchDeckById = (id: string) => {
  //   // this.selectedDeck.setQueryKey(['deck', id])
  //   // this.selectedDeck.setEnabled(true)
  //   return this.selectedDeck.refetch()
  // }
}
