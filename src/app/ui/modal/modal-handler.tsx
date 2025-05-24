import React from 'react'
import { Dialog } from '@mui/material'
import { observer } from 'mobx-react-lite'

import { modalInstance } from '@/common'

export const ModalHandler = observer(() => {
  const modals = modalInstance
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
