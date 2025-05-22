import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { Button, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'

export interface DialogWindowProps {
  key: string
  title?: string
  description?: string
  onConfirmLabel?: string
  onConfirm?: () => void
  onCancelLabel?: string
  onCancel?: () => void
  additionalActions?: ReactNode[]
  content?: ReactNode
}

/**
 * Компонент диалогового окна подтверждения
 */
export const DialogWindow = observer(({
  title,
  description,
  onConfirmLabel,
  onConfirm,
  onCancelLabel,
  onCancel,
  additionalActions,
  content,
}: DialogWindowProps) => {
  return (
    <>
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        {description && (
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        )}
        {content}
      </DialogContent>
      <DialogActions>
        {
          additionalActions && additionalActions
        }
        {onCancelLabel && (
          <Button onClick={onCancel}>
            {onCancelLabel}
          </Button>
        )}
        {onConfirmLabel && (
          <Button onClick={onConfirm} variant="contained" autoFocus>
            {onConfirmLabel}
          </Button>
        )}
      </DialogActions>
    </>
  )
})
