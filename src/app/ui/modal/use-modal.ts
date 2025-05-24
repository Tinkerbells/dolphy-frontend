import { useMemo } from 'react'

import type { ModalType, ModalWindowBase } from '@/core/infrastructure/models/modal'

import { modalInstance } from '@/common'

export function useModal<T extends ModalWindowBase>(
  options: ModalType<T>,
  deps: any[],
) {
  const modal = modalInstance
  return useMemo(() => [
    () => {
      modal.show(options)
    },
    () => {
      modal.hide(options.key)
    },
  ], [...deps])
}

export function openModalWindow<T extends ModalWindowBase>(
  options: ModalType<T>,
) {
  const modal = modalInstance
  modal.show(options)
  return () => {
    modal.hide(options.key)
  }
}

export function closeModalWindowHandler(key: string) {
  const modal = modalInstance
  return () => {
    modal.hide(key)
  }
}

export const modal = {
  show<T extends ModalWindowBase>(options: ModalType<T>) {
    return () => openModalWindow(options)
  },
  hide(key: string) {
    return closeModalWindowHandler(key)
  },
}
