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
} from '@mui/material'

import type { CreateDeckDto } from '@/decks/domain'

interface CreateDeckDialogProps {
  open: boolean
  onClose: () => void
  form: MobxForm<CreateDeckDto>
}

export const CreateDeckDialog = observer(({ open, onClose, form }: CreateDeckDialogProps) => {
  const { t } = useTranslation(['decks', 'common'])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    form.submit()
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('decks:createDeck')}</DialogTitle>

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
            {form.isSubmitting ? t('common:creating') : t('common:create')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
})
