import type { ModalAdapter } from '@/core/infrastructure/adapters/modal'

import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { useInjected } from '../../react'

export function useModal() {
  const modal = useInjected<ModalAdapter>(ModalPortToken)
  return modal
}
