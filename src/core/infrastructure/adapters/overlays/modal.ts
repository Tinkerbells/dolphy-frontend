import { injectable } from 'inversiland'

import type { ModalPort } from '@/core/domain/ports/modal.port'

import type { ModalType } from '../../models/modal'
import type { OverlayQueue } from '../../models/overlay'

import { ModalOverlayQueue } from './modal-queue'

@injectable()
export class ModalAdapter implements ModalPort {
  private readonly modalQueue: OverlayQueue<ModalType<any>>
  private readonly transitionDuration: number = 300

  constructor() {
    this.modalQueue = new ModalOverlayQueue<ModalType<any>>(this.transitionDuration)
  }

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
