import { makeAutoObservable } from 'mobx'

import type { NetError } from '@/common/services/http-client'
import type { OperationResultDto, PaginationResponseDto } from '@/types'
import type { CacheService, Modal, Notify, RouterService } from '@/common'

import { cacheInstance, modalInstance, notify, router } from '@/common'

import type { Deck } from '../models/deck.domain'
import type { CreateDeckDto, UpdateDeckDto } from '../models/dto'
import type { DeckRepository } from '../models/repositories/deck.repository'

import { deckService } from '../services/deck.service'
import { DecksUpdateFormController } from './update-deck-form'
import { DecksCreateFormController } from './create-deck-form'

export interface DecksModals {
  create: () => void
  update: (deck: Deck) => void
  delete: (id: Deck['id']) => void
}

export class DecksController {
  private readonly keys = {
    decks: ['decks'] as const,
  }

  private decksCreateFormController: DecksCreateFormController
  private decksUpdateFormController: DecksUpdateFormController
  private _openModal?: DecksModals

  constructor(
    private readonly modal: Modal,
    private readonly cache: CacheService,
    private readonly notify: Notify,
    private readonly deckService: DeckRepository,
  ) {
    makeAutoObservable(this, {}, { autoBind: true })
    this.decksCreateFormController = new DecksCreateFormController(this.createDeckMutation)
  }

  setModalsHandlers(modalsHandler: DecksModals) {
    this._openModal = modalsHandler
  }

  openCreateModal() {
    this._openModal?.create()
  }

  public get deckCreateForm() {
    return this.decksCreateFormController.createDeckForm
  }

  public deckUpdateForm(deck: Deck) {
    this.decksUpdateFormController = new DecksUpdateFormController(this.updateDeckMutation, deck)
    return this.decksUpdateFormController.updateDeckForm
  }

  public openDeleteModal = (id: Deck['id']) => {
    return () => this._openModal?.delete(id)
  }

  public openUpdateModal = (deck: Deck) => {
    return () => this._openModal?.update(deck)
  }

  public get isLoading() {
    return this.decksQuery.result.isLoading
  }

  public get decks() {
    return this.decksQuery.result.data
  }

  public deleteDeck(id: Deck['id']) {
    return this.deleteDeckMutation.mutate(id)
  }

  private readonly decksQuery = this.cache.createQuery<PaginationResponseDto<Deck>, NetError>(
    () => this.deckService.findAll(),
    { queryKey: this.keys.decks, enableOnDemand: true, suspense: true },
  )

  private _refetchDecks() {
    return this.decksQuery.refetch()
  }

  private readonly createDeckMutation = this.cache.createMutation<Deck, CreateDeckDto, NetError>(
    data => this.deckService.create(data),
    {
      onSuccess: () => {
        this._refetchDecks()
        this.modal.hideAll()
      },
    },
  )

  private readonly deleteDeckMutation
    = this.cache.createMutation<OperationResultDto, Deck['id'], NetError>(
      id => this.deckService.remove(id),
      {
        onSuccess: ({ message }) => {
          this._refetchDecks()
          this.notify.success(message)
          this.modal.hideAll()
        },
      },
    )

  private readonly updateDeckMutation
    = this.cache.createMutation<Deck, { id: Deck['id'], data: UpdateDeckDto }, NetError>(
      ({ id, data }) => this.deckService.update(id, data),
      {
        onSuccess: () => {
          this._refetchDecks()
          this.modal.hideAll()
        },
      },
    )
}

export const decksController = new DecksController(
  modalInstance,
  cacheInstance,
  notify,
  deckService,
)

export function createDeckController() {
  return () => new DecksController(
    modalInstance,
    cacheInstance,
    notify,
    deckService,
  )
}
