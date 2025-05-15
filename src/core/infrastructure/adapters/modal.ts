import { makeObservable } from 'mobx'

import type { ModalOptions, ModalPort, ModalWindowBase } from '@/core/domain/ports/modal.port'

export interface ModalState<T extends ModalWindowBase = ModalWindowBase> {
  scheme: ModalOptions<T>
  isOpened: boolean
}

/**
 * Store для управления модальными окнами
 */
export class ModalAdapter implements ModalPort {
  private _queue: ModalState[] = []
  private readonly _transitionDuration: number = 300

  constructor() {
    makeObservable(this)
  }

  get front(): ModalState | null {
    return this._queue.length ? this._queue[0] : null
  }

  get queue(): ModalState[] {
    return this._queue
  }

  show<T extends ModalWindowBase>(value: ModalOptions<T>): void {
    const existingIndex = this._queue.findIndex(item => item.scheme.key === value.key)

    if (existingIndex >= 0) {
      this._queue[existingIndex].scheme = value as ModalOptions<any>
      return
    }

    this._queue.push({
      scheme: value as ModalOptions<any>,
      isOpened: this._queue.length === 0,
    })

    console.log(this.queue)

    this._updateFront()
  }

  /**
   * Скрывает модальное окно по ключу
   * @param key Ключ модального окна
   */
  hide(key: string): void {
    const index = this._queue.findIndex(item => item.scheme.key === key)

    if (index < 0) {
      return
    }

    if (index === 0) {
      // Если это активное окно, закрываем его с анимацией
      this._queue[0].isOpened = false
      setTimeout(this._dequeue, this._transitionDuration)
    }
    else {
      // Иначе просто удаляем из очереди
      this._queue.splice(index, 1)
    }
  }

  /**
   * Скрывает все модальные окна
   */
  hideAll(): void {
    if (this.front) {
      this.front.isOpened = false
    }

    setTimeout(() => {
      this._queue = []
    }, this._transitionDuration)
  }

  /**
   * Удаляет первый элемент из очереди
   */
  private _dequeue(): void {
    this._queue = this._queue.slice(1)
    this._updateFront()
  }

  /**
   * Обновляет состояние первого элемента в очереди
   */
  private _updateFront(): void {
    const front = this.front
    if (front) {
      front.isOpened = true
    }
  }
}
