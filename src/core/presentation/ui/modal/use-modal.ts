import { useMemo } from 'react'
import { getModuleContainer } from 'inversiland'

import type { ModalPort } from '@/core/domain/ports/modal.port'
import type { ModalAdapter } from '@/core/infrastructure/adapters/overlays'
import type { ModalType, ModalWindowBase } from '@/core/infrastructure/models/modal'

import AppModule from '@/app-module'
import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { useInjected } from '../../react'

export function useModal<T extends ModalWindowBase>(
  options: ModalType<T>,
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

export function openModalWindow<T extends ModalWindowBase>(
  options: ModalType<T>,
) {
  const container = getModuleContainer(AppModule)
  const modal = container.getProvided(ModalPortToken) as ModalAdapter
  modal.show(options)
  return () => {
    modal.hide(options.key)
  }
}

export function closeModalWindowHandler(key: string) {
  const container = getModuleContainer(AppModule)
  const modal = container.getProvided(ModalPortToken) as ModalAdapter
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
