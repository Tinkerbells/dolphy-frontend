import { useMemo } from 'react'

import type { ModalType } from '@/common'

import { modalInstance } from '@/common'

import type { DialogWindowProps } from './dialog-window'

import { DialogWindow } from './dialog-window'

export function useDialog(
  options: Omit<ModalType<DialogWindowProps>, 'element'>,
  deps: any[],
) {
  const modal = modalInstance
  return useMemo(() => [
    () => {
      modal.show({
        element: DialogWindow,
        props: options.props,
        title: options.title,
        description: options.description,
        key: options.key,
      })
    },
    () => {
      modal.hide(options.key)
    },
  ], [...deps])
}

export function openDialogWindow(
  options: Omit<ModalType<DialogWindowProps>, 'element'>,
) {
  const modal = modalInstance
  modal.show({
    element: DialogWindow,
    props: options.props,
    title: options.title,
    description: options.description,
    key: options.key,
  })
  return () => {
    modal.hide(options.key)
  }
}

export function closeDialogWindow(key: string) {
  const modal = modalInstance
  return () => {
    modal.hide(key)
  }
}

export const dialog = {
  show(options: Omit<ModalType<DialogWindowProps>, 'element'>) {
    return () => openDialogWindow(options)
  },
  hide(key: string) {
    return closeDialogWindow(key)
  },
}
