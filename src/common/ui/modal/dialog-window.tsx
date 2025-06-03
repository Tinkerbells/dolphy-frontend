import type { ReactNode } from 'react'

import { observer } from 'mobx-react-lite'
import { Button, DialogActions } from '@mui/material'

import { modalInstance } from '@/common/services'

export interface DialogWindowProps {
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
  onConfirmLabel,
  onConfirm,
  onCancelLabel,
  onCancel,
  additionalActions,
  content,
}: DialogWindowProps) => {
  const modals = modalInstance
  const modal = modals.queue.front
  if (!modal) {
    return null
  }
  return (
    <>
      {content}
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
