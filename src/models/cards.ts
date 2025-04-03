import { calculateNewDifficulty, calculateNextDueDate, calculateNextStatus } from '@/common/functions'

/**
 * Содержимое фронтальной стороны карточки (вопрос)
 */
export type CardFront = string

/**
 * Содержимое обратной стороны карточки (ответ)
 */
export type CardBack = string

/**
 * DTO для флеш-карточки
 */
export interface CardDto {
  id: UniqueId
  deckId: UniqueId
  front: CardFront
  back: CardBack
  created: DateTimeString
  lastReviewed?: DateTimeString
  difficulty: DifficultyLevel
  status: StudyStatus
  dueDate?: DateTimeString
  tags: string[]
}

/**
 * Доменная модель флеш-карточки
 */
export class Card implements CardDto {
  id: UniqueId
  deckId: UniqueId
  front: CardFront
  back: CardBack
  created: DateTimeString
  lastReviewed?: DateTimeString
  difficulty: DifficultyLevel
  status: StudyStatus
  dueDate?: DateTimeString
  tags: string[]

  constructor(cardDto: CardDto) {
    this.id = cardDto.id
    this.deckId = cardDto.deckId
    this.front = cardDto.front
    this.back = cardDto.back
    this.created = cardDto.created
    this.lastReviewed = cardDto.lastReviewed
    this.difficulty = cardDto.difficulty
    this.status = cardDto.status
    this.dueDate = cardDto.dueDate
    this.tags = [...cardDto.tags]
  }

  /**
   * Проверяет, нужно ли повторить карточку
   */
  get isDue(): boolean {
    if (this.status === 'new')
      return true
    if (!this.dueDate)
      return true

    return new Date(this.dueDate) <= new Date()
  }

  /**
   * Обновляет свойства карточки
   */
  update(updates: Partial<Omit<CardDto, 'id' | 'deckId' | 'created'>>): void {
    Object.assign(this, updates)
  }

  /**
   * Записывает результат повторения
   */
  recordReview(answer: 'again' | 'hard' | 'good' | 'easy'): void {
    const now = new Date().toISOString()
    this.lastReviewed = now

    // Рассчитываем новую сложность
    this.difficulty = calculateNewDifficulty(this.difficulty, answer)

    // Рассчитываем новый статус
    this.status = calculateNextStatus(this.status, answer)

    // Рассчитываем дату следующего повторения
    this.dueDate = calculateNextDueDate(this.difficulty, this.status, answer)
  }

  /**
   * Сбрасывает карточку в статус "новая"
   */
  reset(): void {
    this.difficulty = 0
    this.status = 'new'
    this.dueDate = undefined
    this.lastReviewed = undefined
  }

  /**
   * Проверяет, есть ли у карточки определённый тег
   */
  hasTag(tag: string): boolean {
    return this.tags.includes(tag)
  }

  /**
   * Добавляет тег к карточке
   */
  addTag(tag: string): void {
    if (!this.tags.includes(tag)) {
      this.tags.push(tag)
    }
  }

  /**
   * Удаляет тег из карточки
   */
  removeTag(tag: string): void {
    this.tags = this.tags.filter(t => t !== tag)
  }

  /**
   * Преобразует в DTO
   */
  toDto(): CardDto {
    return {
      id: this.id,
      deckId: this.deckId,
      front: this.front,
      back: this.back,
      created: this.created,
      lastReviewed: this.lastReviewed,
      difficulty: this.difficulty,
      status: this.status,
      dueDate: this.dueDate,
      tags: [...this.tags],
    }
  }
}

/**
 * Коллекция карточек
 */
export class Cards {
  cards: CardDto[] = []

  constructor(cards: CardDto[] = []) {
    this.cards = cards
  }

  /**
   * Получает количество карточек
   */
  get count(): number {
    return this.cards.length
  }

  /**
   * Проверяет, есть ли карточки
   */
  get hasCards(): boolean {
    return this.cards.length > 0
  }

  /**
   * Находит карточку по ID
   */
  getCard(cardId: string): CardDto | undefined {
    return this.cards.find(card => card.id === cardId)
  }

  /**
   * Получает карточки по статусу
   */
  getCardsByStatus(status: StudyStatus): CardDto[] {
    return this.cards.filter(card => card.status === status)
  }

  /**
   * Получает карточки, которые пора повторить
   */
  getDueCards(): CardDto[] {
    const now = new Date().toISOString()
    return this.cards.filter(card =>
      card.status === 'new'
      || !card.dueDate
      || card.dueDate <= now,
    )
  }

  /**
   * Получает карточки по тегу
   */
  getCardsByTag(tag: string): CardDto[] {
    return this.cards.filter(card => card.tags.includes(tag))
  }

  /**
   * Получает все уникальные теги
   */
  get allTags(): string[] {
    const tagsSet = new Set<string>()
    this.cards.forEach((card) => {
      card.tags.forEach(tag => tagsSet.add(tag))
    })
    return Array.from(tagsSet).sort()
  }

  /**
   * Получает статистику по карточкам
   */
  getStats(): {
    total: number
    new: number
    learning: number
    review: number
    relearning: number
    dueNow: number
  } {
    const now = new Date().toISOString()

    return {
      total: this.cards.length,
      new: this.cards.filter(card => card.status === 'new').length,
      learning: this.cards.filter(card => card.status === 'learning').length,
      review: this.cards.filter(card => card.status === 'review').length,
      relearning: this.cards.filter(card => card.status === 'relearning').length,
      dueNow: this.cards.filter(card =>
        card.status === 'new'
        || !card.dueDate
        || card.dueDate <= now,
      ).length,
    }
  }
}
