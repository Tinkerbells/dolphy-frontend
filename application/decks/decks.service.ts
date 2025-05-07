import { inject, injectable } from 'inversify'

import type { PaginationResponseDto } from '@/utils'
import type { CreateDeckDto, Deck, DeckRepository, NotificationPort, UpdateDeckDto } from '@/domain'

import { Symbols } from '@/di'

/**
 * Use case для работы с колодами
 */
@injectable()
export class DecksService {
  constructor(
    @inject(Symbols.DeckRepository) private deckRepository: DeckRepository,
    @inject(Symbols.NotificationKey) private notify: NotificationPort,
  ) {}

  /**
   * Получает все колоды пользователя
   */
  async getAll(): Promise<PaginationResponseDto<Deck>> {
    try {
      const response = await this.deckRepository.findAll()
      return response
    }
    catch (error) {
      this.notify.error('Не удалось загрузить колоды', error.message)
      throw error
    }
  }

  /**
   * Получает колоду по ID
   */
  async getById(id: Deck['id']): Promise<Deck> {
    try {
      return await this.deckRepository.findById(id)
    }
    catch (error) {
      this.notify.error('Не удалось загрузить колоду', error.message)
      throw error
    }
  }

  /**
   * Создает новую колоду
   */
  async create(data: CreateDeckDto): Promise<Deck> {
    try {
      const deck = await this.deckRepository.create(data)
      this.notify.success('Колода успешно создана')
      return deck
    }
    catch (error) {
      this.notify.error('Не удалось создать колоду', error.message)
      throw error
    }
  }

  /**
   * Обновляет существующую колоду
   */
  async update(id: Deck['id'], data: UpdateDeckDto): Promise<Deck> {
    try {
      const deck = await this.deckRepository.update(id, data)
      this.notify.success('Колода успешно обновлена')
      return deck
    }
    catch (error) {
      this.notify.error('Не удалось обновить колоду', error.message)
      throw error
    }
  }

  /**
   * Удаляет колоду
   */
  async remove(id: Deck['id']): Promise<void> {
    try {
      await this.deckRepository.remove(id)
      this.notify.success('Колода успешно удалена')
    }
    catch (error) {
      console.error(error)
      // this.notify.error('Не удалось удалить колоду', error.message)
      throw error
    }
  }
}
