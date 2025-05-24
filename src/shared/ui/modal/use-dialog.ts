import { useMemo } from 'react'

import { modalInstance } from '@/common'

import type { DialogWindowProps } from './dialog-window'

import { DialogWindow } from './dialog-window'

export function useDialog(
  options: DialogWindowProps,
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

export function openDialogWindow(
  options: DialogWindowProps,
) {
  const modal = modalInstance
  modal.show({
    element: DialogWindow,
    props: options,
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
  show(options: DialogWindowProps) {
    return () => openDialogWindow(options)
  },
  hide(key: string) {
    return closeDialogWindow(key)
  },
}
