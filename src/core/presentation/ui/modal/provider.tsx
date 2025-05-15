import type { ComponentType, ReactNode } from 'react'

import { useEffect } from 'react'

import type { ModalsAdapter } from '../../../infrastructure/adapters/modal'
import type { ModalsLabels, ModalsPort } from '../../../domain/ports/modal.port'

import { useInjected } from '../../react'
import { ModalsPortToken } from '../../../domain/ports/modal.port'
import { ConfirmModal, ContentModal, ContextModal } from './components'

interface ModalsProviderProps {
  modals?: Record<string, ComponentType<any>>
  labels?: ModalsLabels
  children: ReactNode
}

export function ModalsProvider({ modals, labels, children }: ModalsProviderProps) {
  const modalsAdapter = useInjected<ModalsAdapter>(ModalsPortToken)

  useEffect(() => {
    modalsAdapter.setup(
      {
        confirmModal: ConfirmModal,
        contextModal: ContextModal,
        contentModal: ContentModal,
      },
      modals,
      labels,
    )
  }, [modals, labels])

  return (
    <>
      {children}
      <ConfirmModal.Root />
      <ContentModal.Root />
      <ContextModal.Root />
    </>
  )
}

export function useModals(): ModalsPort {
  return useInjected<ModalsPort>(ModalsPortToken)
}
