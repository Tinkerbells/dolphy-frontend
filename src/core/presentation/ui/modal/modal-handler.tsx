import React from 'react'
import { Dialog } from '@mui/material'
import { observer } from 'mobx-react-lite'

import type { ModalPort } from '@/core/domain/ports/modal.port'
import type { ModalAdapter } from '@/core/infrastructure/adapters/overlays'

import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { useInjected } from '../../react'

export const ModalHandler = observer(() => {
  const modals = useInjected<ModalPort>(ModalPortToken) as ModalAdapter
  const modal = modals.queue.front
  const closeHandle: (() => void) | undefined = modal && modal.scheme.props.onClose
  return modal
    ? (
        <>
          <Dialog
            open={modal.isOpened}
            onClose={closeHandle || (() => modals.hide(modal?.scheme.key))}
          >
            {React.createElement(modal.scheme.element, modal.scheme.props)}
          </Dialog>
        </>
      )
    : null
})
