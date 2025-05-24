import { computed, makeObservable, observable } from 'mobx'

export interface QueueItem {
  key: string
}

export interface OverlayState<T extends QueueItem> {
  scheme: T
  isOpened: boolean
  details?: any
}

export interface OverlayQueue<T extends QueueItem> {
  front: OverlayState<T> | null
  length: number
  queue: OverlayState<T>[]
  show: (value: T) => void
  hide: (key: string) => void
  hideAll: () => void
}

export abstract class OverlayQueueBase<T extends QueueItem> implements OverlayQueue<T> {
  queue: OverlayState<T>[]

  constructor() {
    makeObservable(this, {
      queue: observable,
      length: computed,
    })
    this.queue = []
  }

  abstract get front(): OverlayState<T> | null

  get length(): number {
    return this.queue.length
  }

  show(value: T): void {
    const state = this._get(value.key)
    if (state) {
      this._update(value, state)
      return
    }
    this._add(value)
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  protected _update(value: T, state: OverlayState<T>) {}

  protected _get(key: string): OverlayState<T> | undefined {
    return this.queue.find(item => item.scheme.key === key)
  }

  protected _indexOf(key: string): number {
    return this.queue.findIndex(elem => elem.scheme.key === key)
  }

  abstract _add(value: T): void

  hide(key: string): void {
    const index = this._indexOf(key)
    if (index < 0) {
      return
    }
    this._remove(index)
  }

  abstract _remove(index: number): void

  abstract hideAll(): void
}
