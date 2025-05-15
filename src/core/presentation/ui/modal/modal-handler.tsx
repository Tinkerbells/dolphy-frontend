import React from 'react'
import { Dialog } from '@mui/material'
import { observer } from 'mobx-react-lite'

import type { ModalAdapter } from '@/core/infrastructure/adapters/modal'

import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { useInjected } from '../../react'

export const ModalHandler = observer(() => {
  const modals = useInjected<ModalAdapter>(ModalPortToken)
  const modal = modals.queue.front
  const closeHandle: (() => void) | undefined = modal && modal.scheme.props.onClose
  return modal
    ? (
        <>
          <Dialog
            open={modal.isOpened}
            onClose={modal.scheme.isBlocking
              ? undefined
              : closeHandle || (() => modals.hide(modal?.scheme.key))}
          >
            {React.createElement(modal.scheme.element, modal.scheme.props)}
          </Dialog>
        </>
      )
    : null
})
