import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material'

interface DeleteDeckDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  deckName: string
  isSubmitting: boolean
}

/**
 * Диалог подтверждения удаления колоды
 */
export const DeleteDeckDialog: React.FC<DeleteDeckDialogProps> = ({
  open,
  onClose,
  onConfirm,
  deckName,
  isSubmitting,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <DialogTitle id="delete-dialog-title">
        Удалить колоду
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="delete-dialog-description">
          Вы действительно хотите удалить колоду "
          {deckName}
          "? Это действие нельзя отменить.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Отмена
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Удаление...' : 'Удалить'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
