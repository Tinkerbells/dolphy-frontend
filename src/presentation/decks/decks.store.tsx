import type { MobxQueryClient } from 'mobx-tanstack-query'

import { makeAutoObservable } from 'mobx'
import { inject, injectable } from 'inversify'
import { MobxMutation, MobxQuery } from 'mobx-tanstack-query'

import type { Decks } from '@/application/decks'
import type { PaginationResponseDto } from '@/utils'
import type { CreateDeckDto, Deck, UpdateDeckDto } from '@/domain'

import { Symbols } from '@/di'

/**
 * Хранилище данных о колодах пользователя
 */
@injectable()
export class DecksStore {
  private decksKey: string = 'decks'

  // Query для получения списка колод
  public decks: MobxQuery<PaginationResponseDto<Deck>, Error> = new MobxQuery({
    queryClient: this.queryClient,
    queryKey: [this.decksKey],
    queryFn: async () => {
      return await this.decksService.getAll()
    },
  })

  // Mutation для создания колоды
  public createDeck: MobxMutation<Deck, CreateDeckDto, Error> = new MobxMutation({
    queryClient: this.queryClient,
    mutationFn: (dto: CreateDeckDto) => this.decksService.create(dto),
    onSuccess: () => {
      this.invalidate()
    },
  })

  // Mutation для обновления колоды
  public updateDeck: MobxMutation<Deck, { id: Deck['id'], data: UpdateDeckDto }, Error> = new MobxMutation({
    queryClient: this.queryClient,
    mutationFn: ({ id, data }) => this.decksService.update(id, data),
    onSuccess: () => {
      this.invalidate()
    },
  })

  // Mutation для удаления колоды
  public deleteDeck: MobxMutation<void, Deck['id'], Error> = new MobxMutation({
    queryClient: this.queryClient,
    mutationFn: (id: Deck['id']) => this.decksService.remove(id),
    onSuccess: () => {
      this.invalidate()
    },
  })

  constructor(
    @inject(Symbols.Decks) private decksService: Decks,
    @inject(Symbols.QueryClient) private queryClient: MobxQueryClient,
  ) {
    makeAutoObservable(this)
  }

  protected invalidate() {
    this.queryClient.invalidateQueries({ queryKey: [this.decksKey] })
  }
}
