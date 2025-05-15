import { makeAutoObservable } from 'mobx'

import type { ModalOptions, ModalPort, ModalWindowBase } from '@/core/domain/ports/modal.port'

export interface ModalState<T extends ModalWindowBase = ModalWindowBase> {
  scheme: ModalOptions<T>
  isOpened: boolean
}

/**
 * Store для управления модальными окнами
 */
export class ModalAdapter implements ModalPort {
  queue: ModalState[] = []
  readonly transitionDuration: number = 300

  constructor() {
    makeAutoObservable(this)

    this.dequeue = this.dequeue.bind(this)
  }

  get front(): ModalState | null {
    return this.queue.length ? this.queue[0] : null
  }

  show<T extends ModalWindowBase>(value: ModalOptions<T>): void {
    const existingIndex = this.queue.findIndex(item => item.scheme.key === value.key)

    if (existingIndex >= 0) {
      this.queue[existingIndex].scheme = value as ModalOptions<any>
      return
    }

    this.queue.push({
      scheme: value as ModalOptions<any>,
      isOpened: this.queue.length === 0,
    })

    this.updateFront()
  }

  hide(key: string): void {
    const index = this.queue.findIndex(item => item.scheme.key === key)

    if (index < 0) {
      return
    }

    if (index === 0) {
      this.queue[0].isOpened = false
      setTimeout(this.dequeue, this.transitionDuration)
    }
    else {
      this.queue.splice(index, 1)
    }
  }

  hideAll(): void {
    if (this.front) {
      this.front.isOpened = false
    }

    setTimeout(() => {
      this.queue = []
    }, this.transitionDuration)
  }

  dequeue(): void {
    this.queue = this.queue.slice(1)
    this.updateFront()
  }

  updateFront(): void {
    const front = this.front
    if (front) {
      front.isOpened = true
    }
  }
}
