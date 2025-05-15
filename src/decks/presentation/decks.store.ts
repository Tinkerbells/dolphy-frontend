import { makeAutoObservable } from 'mobx'
import { MobxForm } from 'mobx-react-hook-form'
import { inject, injectable } from 'inversiland'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'

import type { Deck } from '@/decks/domain'
import type { PaginationResponseDto } from '@/types'
import type { NotifyPort } from '@/core/domain/ports/notify.port'
import type { NetError } from '@/core/infrastructure/models/net-error'

import { queryClient } from '@/core/presentation/react'
import { handleFormErrors } from '@/core/presentation/ui'
import { CreateDeckDto, UpdateDeckDto } from '@/decks/domain'
import { NotifyPortToken } from '@/core/domain/ports/notify.port'
import {
  CreateDeckUseCase,
  DeleteDeckUseCase,
  GetDeckByIdUseCase,
  GetDecksUseCase,
  UpdateDeckUseCase,
} from '@/decks/application'

@injectable()
export class DecksStore {
  // Состояние UI
  isCreateDeckDialogOpen = false
  isEditDeckDialogOpen = false
  selectedDeckId: string | null = null

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

  // Мутации
  createDeck = new MobxMutation<Deck, CreateDeckDto, NetError>({
    queryClient,
    mutationFn: data => this.createDeckUseCase.execute(data),
    onSuccess: () => {
      this.notify.success('Колода успешно создана')
      this.decks.refetch()
      this.closeCreateDeckDialog()
    },
    onError: (error) => {
      handleFormErrors(this.createDeckForm, error, this.notify, {
        focusFirstError: true,
      })
    },
  })

  updateDeck = new MobxMutation<Deck, { id: string, data: UpdateDeckDto }, NetError>({
    queryClient,
    mutationFn: ({ id, data }) => this.updateDeckUseCase.execute({ id, data }),
    onSuccess: () => {
      this.notify.success('Колода успешно обновлена')
      this.decks.refetch()
      this.closeEditDeckDialog()
    },
    onError: (error) => {
      handleFormErrors(this.editDeckForm, error, this.notify, {
        focusFirstError: true,
      })
    },
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

  // Формы
  createDeckForm: MobxForm<CreateDeckDto>
  editDeckForm: MobxForm<UpdateDeckDto>

  constructor(
    @inject(GetDecksUseCase) private getDecksUseCase: GetDecksUseCase,
    @inject(GetDeckByIdUseCase) private getDeckByIdUseCase: GetDeckByIdUseCase,
    @inject(CreateDeckUseCase) private createDeckUseCase: CreateDeckUseCase,
    @inject(UpdateDeckUseCase) private updateDeckUseCase: UpdateDeckUseCase,
    @inject(DeleteDeckUseCase) private deleteDeckUseCase: DeleteDeckUseCase,
    @inject(NotifyPortToken) private notify: NotifyPort,
  ) {
    makeAutoObservable(this)

    this.createDeckForm = new MobxForm<CreateDeckDto>({
      defaultValues: {
        name: '',
        description: '',
      },
      resolver: classValidatorResolver(CreateDeckDto),
      mode: 'onChange',
      onSubmit: this.handleCreateDeck,
    })

    this.editDeckForm = new MobxForm<UpdateDeckDto>({
      defaultValues: {
        name: '',
        description: '',
      },
      resolver: classValidatorResolver(UpdateDeckDto),
      mode: 'onChange',
      onSubmit: this.handleUpdateDeck,
    })
  }

  // UI методы
  openCreateDeckDialog = () => {
    this.isCreateDeckDialogOpen = true
    this.createDeckForm.reset()
  }

  closeCreateDeckDialog = () => {
    this.isCreateDeckDialogOpen = false
    this.createDeckForm.reset()
  }

  openEditDeckDialog = (deck: Deck) => {
    this.isEditDeckDialogOpen = true
    this.selectedDeckId = deck.id
    this.editDeckForm.reset()
  }

  closeEditDeckDialog = () => {
    this.isEditDeckDialogOpen = false
    this.selectedDeckId = null
  }

  // Обработчики форм
  handleCreateDeck = (data: CreateDeckDto) => {
    this.createDeck.mutate(data)
  }

  handleUpdateDeck = (data: UpdateDeckDto) => {
    if (!this.selectedDeckId)
      return
    this.updateDeck.mutate({ id: this.selectedDeckId, data })
  }

  handleDeleteDeck = (id: string) => {
    this.deleteDeck.mutate(id)
  }

  // Получение колоды по ID для редактирования
  fetchDeckById = (id: string) => {
    // this.selectedDeck.setQueryKey(['deck', id])
    // this.selectedDeck.setEnabled(true)
    return this.selectedDeck.refetch()
  }
}
