import type { ModalPort } from '@/core/domain/ports/modal.port'

import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { useInjected } from '../../react'

export function useModal() {
  const modal = useInjected<ModalPort>(ModalPortToken)
  return modal
}
