import type { ComponentType } from 'react'

import type { OverlayQueue } from './overlay'

import { modalQueueInstance } from './modal-queue'

export interface Modal {
  show: (options: any) => void
  hide: (key: string) => void
  hideAll: () => void
}

export interface ModalType<T> {
  element: ComponentType<T>
  props: T
  key: string
  title?: string
  description?: string
}

class ModalService implements Modal {
  constructor(private readonly modalQueue: OverlayQueue<ModalType<any>>) { }

  show(value: ModalType<any>): void {
    this.modalQueue.show(value)
  }

  hide(key: string): void {
    this.modalQueue.hide(key)
  }

  hideAll(): void {
    this.modalQueue.hideAll()
  }

  get queue(): OverlayQueue<ModalType<any>> {
    return this.modalQueue
  }
}

export const modalInstance = new ModalService(modalQueueInstance)
