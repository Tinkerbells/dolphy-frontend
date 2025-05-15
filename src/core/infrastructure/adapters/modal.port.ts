import { action, computed, makeObservable } from 'mobx'

import type { ModalPort } from '@/core/domain/ports/modal.port'
import type { OverlayState } from '@/core/domain/types/overlay.type'

import type { ModalType, ModalWindowBase } from '../models/modal'

import { OverlayQueueBase } from './overlay'

export class ModalAdapter<T extends ModalType<any>> extends OverlayQueueBase<T> implements ModalPort {
  private readonly _transitionDuration: number

  constructor(transitionDuration: number) {
    super()
    makeObservable(this, {
      front: computed,
      _add: action,
      _remove: action,
      _dequeue: action.bound,
      _updateFront: action,
      hideAll: action,
    })
    this._transitionDuration = transitionDuration
  }

  get front(): OverlayState<T> | null {
    return this.queue.length ? this.queue[0] : null
  }

  _add(value: T): void {
    this.queue.push({
      scheme: value,
      isOpened: this.queue.length === 0,
    })
    this._updateFront()
  }

  _remove(index: number): void {
    if (index > 0) {
      this.queue.splice(index, 1)
      return
    }
    if (!this.queue[index]?.isOpened) {
      return
    }
    this.queue[index].isOpened = false
    setTimeout(this._dequeue, this._transitionDuration)
  }

  _dequeue() {
    this.queue = this.queue.slice(1)
    this._updateFront()
  }

  _updateFront() {
    const front = this.front
    if (front) {
      front.isOpened = true
    }
  }

  show<T extends ModalWindowBase>(value: ModalType<T>): void {
    this.show(value as ModalType<any>)
  }

  hide(key: string): void {
    this.hide(key)
  }

  hideAll(): void {
    if (this.front) {
      this.front.isOpened = false
    }

    setTimeout(() => {
      this.queue = []
    }, this._transitionDuration)
  }
}

