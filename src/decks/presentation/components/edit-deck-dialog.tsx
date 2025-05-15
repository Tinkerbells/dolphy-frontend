import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

import type { UpdateDeckDto } from '@/decks/domain'

interface EditDeckDialogProps {
  open: boolean
  onClose: () => void
  form: MobxForm<UpdateDeckDto>
}

export const EditDeckDialog = observer(({ open, onClose, form }: EditDeckDialogProps) => {
  const { t } = useTranslation(['decks', 'common'])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.submit()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('decks:editDeck')}</DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={3}>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            {t('common:cancel')}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
          >
            {form.isSubmitting ? t('common:saving') : t('common:save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})
