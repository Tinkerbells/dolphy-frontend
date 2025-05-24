import type { ComponentType } from 'react'

import type { Modal } from '@/common'

import type { OverlayQueue } from './overlay'

import { modalQueueInstance } from './modal-queue'

export interface ModalWindowBase {
  onClose?: () => void
}

export interface ModalType<T extends ModalWindowBase> {
  element: ComponentType<T>
  props: T
  key: string
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
