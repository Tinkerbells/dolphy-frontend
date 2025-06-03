import React from 'react'
import { observer } from 'mobx-react-lite'
import CloseIcon from '@mui/icons-material/Close'
import { Dialog, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material'

import { modalInstance } from '@/common/services/overlays/modal'

export const ModalHandler = observer(() => {
  const modals = modalInstance
  const modal = modals.queue.front
  const closeHandle: (() => void) | undefined = modal && modal.scheme.props.onClose
  if (!modal) {
    return null
  }
  return (
    <Dialog
      open={modal.isOpened}
      onClose={closeHandle || (() => modals.hide(modal?.scheme.key))}
      disableRestoreFocus
    >
      {modal.scheme.title && (
        <DialogTitle
          id="alert-dialog-title"
          sx={{ pb: 0 }}
        >
          {modal.scheme.title}
        </DialogTitle>
      )}
      <IconButton
        aria-label="close"
        onClick={(() => modals.hide(modal?.scheme.key))}
        sx={theme => ({
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        })}
      >
        <CloseIcon />
      </IconButton>
      {modal.scheme.description && (
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {modal.scheme.description}
          </DialogContentText>
        </DialogContent>
      )}
      {React.createElement(modal.scheme.element, modal.scheme.props)}
    </Dialog>
  )
})
