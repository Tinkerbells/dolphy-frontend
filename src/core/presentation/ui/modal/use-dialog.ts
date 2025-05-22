import { useMemo } from 'react'
import { getModuleContainer } from 'inversiland'

import type { ModalPort } from '@/core/domain/ports/modal.port'
import type { ModalAdapter } from '@/core/infrastructure/adapters/overlays'

import AppModule from '@/app-module'
import { ModalPortToken } from '@/core/domain/ports/modal.port'

import type { DialogWindowProps } from './dialog-window'

import { useInjected } from '../../react'
import { DialogWindow } from './dialog-window'

export function useDialog(
  options: DialogWindowProps,
  deps: any[],
) {
  const modal = useInjected<ModalPort>(ModalPortToken)
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
  const container = getModuleContainer(AppModule)
  const modal = container.getProvided(ModalPortToken) as ModalAdapter
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
  const container = getModuleContainer(AppModule)
  const modal = container.getProvided(ModalPortToken) as ModalAdapter
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
