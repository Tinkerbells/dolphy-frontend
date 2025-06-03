import { useMemo } from 'react'

import type { ModalType } from '@/common'

import { modalInstance } from '@/common'

export function useModal<T>(
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

export function openModalWindow<T>(
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
  show<T>(options: ModalType<T>) {
    return () => openModalWindow(options)
  },
  hide(key: string) {
    return closeModalWindowHandler(key)
  },
}
