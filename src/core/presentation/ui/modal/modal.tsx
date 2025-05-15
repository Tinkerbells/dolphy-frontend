import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export interface DialogWindowProps {
  onClose?: () => void
  header: string
  primaryLabel: string
  primaryAction: () => void
  secondaryLabel?: string
  secondaryAction?: () => void
  children?: React.ReactNode
}

/**
 * Компонент диалогового окна подтверждения
 */
export const DialogWindow: React.FC<DialogWindowProps> = ({
  onClose,
  header,
  primaryLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
  children,
}) => {
  return (
    <Dialog
      open={true}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {header}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {secondaryLabel && (
          <Button onClick={secondaryAction || onClose}>
            {secondaryLabel}
          </Button>
        )}
        <Button onClick={primaryAction} variant="contained" autoFocus>
          {primaryLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
