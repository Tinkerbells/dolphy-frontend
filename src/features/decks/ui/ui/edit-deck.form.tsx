import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { FormProvider } from 'react-hook-form'
import { Box, Button, Grid } from '@mui/material'

import type { UpdateDeckDto } from '@/features/decks/models/dto'

import { FormTextInput } from '@/common'

export interface EditDeckFormProps {
  editDeckForm: MobxForm<UpdateDeckDto>
  onCancel: () => void
}

export const EditDeckForm = observer(({ editDeckForm, onCancel }: EditDeckFormProps) => {
  const { t } = useTranslation(['decks', 'common'])
  return (
    <FormProvider formState={{ ...editDeckForm }} {...editDeckForm.originalForm}>
      <Box
        component="form"
        onSubmit={editDeckForm.submit}
        sx={{
          maxWidth: 400,
          px: 2,
          pb: 2,
        }}
      >
        <Grid container spacing={2} mb={2} sx={{ marginTop: 3 }}>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<UpdateDeckDto> autoFocus name="name" label={t('decks:deckName')} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<UpdateDeckDto> multiline minRows={5} name="description" label={t('decks:deckDescription')} />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Button
              fullWidth
              variant="outlined"
              color="primary"
              onClick={onCancel}
            >
              {t('common:actions.cancel')}
            </Button>
          </Grid>
          <Grid size={{ xs: 6 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={editDeckForm.isSubmitting || !editDeckForm.isValid}
              loading={editDeckForm.isSubmitting}
            >
              {t('decks:editDeck')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  )
})
