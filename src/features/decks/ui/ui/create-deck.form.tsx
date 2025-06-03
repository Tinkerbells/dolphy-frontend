import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { FormProvider } from 'react-hook-form'
import { Box, Button, Grid } from '@mui/material'

import type { CreateDeckDto } from '@/features/decks/models/dto'

import { FormTextInput } from '@/common'

export interface CreateDeckFormProps {
  createDeckForm: MobxForm<CreateDeckDto>
  onCancel: () => void
}

export const CreateDeckForm = observer(({ createDeckForm, onCancel }: CreateDeckFormProps) => {
  const { t } = useTranslation(['decks', 'common'])
  return (
    <FormProvider formState={{ ...createDeckForm }} {...createDeckForm.originalForm}>
      <Box
        component="form"
        onSubmit={createDeckForm.submit}
        sx={{
          maxWidth: 400,
          px: 2,
          pb: 2,
        }}
      >
        <Grid container spacing={2} mb={2} sx={{ marginTop: 3 }}>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateDeckDto> autoFocus name="name" label={t('decks:deckName')} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateDeckDto> multiline minRows={5} name="description" label={t('decks:deckDescription')} />
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
              disabled={createDeckForm.isSubmitting || !createDeckForm.isValid}
              loading={createDeckForm.isSubmitting}
            >
              {t('decks:createDeck')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  )
})
