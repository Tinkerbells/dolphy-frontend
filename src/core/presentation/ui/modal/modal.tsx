import React from 'react'
import { observer } from 'mobx-react-lite'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

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
export const DialogWindow = observer(({
  onClose,
  header,
  primaryLabel,
  primaryAction,
  secondaryLabel,
  secondaryAction,
  children,
}: DialogWindowProps) => {
  console.log('Render')
  return (
    <>
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
    </>
  )
})
