import { injectable } from 'inversiland'

import type { ModalPort } from '@/core/domain/ports/modal.port'

import type { OverlayQueue } from '../../models/overlay'
import type { ModalType, ModalWindowBase } from '../../models/modal'

import { ModalOverlayQueue } from './modal-queue'

@injectable()
export class ModalAdapter implements ModalPort {
  private readonly modalQueue: OverlayQueue<ModalType<any>>
  private readonly transitionDuration: number = 300

  constructor() {
    this.modalQueue = new ModalOverlayQueue<ModalType<any>>(this.transitionDuration)
  }

  show<T extends ModalWindowBase>(value: ModalType<T>): void {
    this.modalQueue.show(value as ModalType<any>)
  }

  hide(key: string): void {
    this.modalQueue.hide(key)
  }

  hideAll(): void {
    this.modalQueue.hideAll()
  }

  getQueue(): OverlayQueue<ModalType<any>> {
    return this.modalQueue
  }
}
