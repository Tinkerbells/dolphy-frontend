import React from 'react'
import { Dialog } from '@mui/material'
import { observer } from 'mobx-react-lite'

import type { ModalAdapter } from '@/core/infrastructure/adapters/modal.port'

import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { useInjected } from '../../react'

export const ModalHandler = observer(() => {
  const modals = useInjected<ModalAdapter>(ModalPortToken)
  const modal = modals.front
  return modal
    ? (
        <>
          <Dialog open={modal.isOpened}>
            {React.createElement(modal.scheme.element, modal.scheme.props)}
          </Dialog>
        </>
      )
    : null
})
