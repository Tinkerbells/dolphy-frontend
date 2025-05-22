import type { ComponentType } from 'react'

export interface ModalWindowBase {
  onClose?: () => void
}

export interface ModalType<T extends ModalWindowBase> {
  element: ComponentType<T>
  props: T
  key: string
}
