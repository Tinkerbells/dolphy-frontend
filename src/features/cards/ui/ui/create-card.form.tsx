import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { FormProvider } from 'react-hook-form'
import { Box, Button, Grid } from '@mui/material'

import type { CreateCardDto } from '@/features/cards/models'

import { FormRichTextInput, FormTextInput } from '@/common'

export interface CreateCardFormProps {
  createCardForm: MobxForm<CreateCardDto>
  onCancel: () => void
}

export const CreateCardForm = observer(({ createCardForm, onCancel }: CreateCardFormProps) => {
  const { t } = useTranslation(['decks', 'common'])
  return (
    <FormProvider formState={{ ...createCardForm }} {...createCardForm.originalForm}>
      <Box
        component="form"
        onSubmit={createCardForm.submit}
        sx={{
          maxWidth: 400,
          px: 2,
          pb: 2,
        }}
      >
        <Grid container spacing={2} mb={2} sx={{ marginTop: 3 }}>
          <Grid size={{ xs: 12 }}>
            <FormRichTextInput<CreateCardDto>
              autoFocus
              name="question"
              label={t('cards:question')}
              placeholder={t('cards:questionPlaceholder')}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormRichTextInput<CreateCardDto>
              name="answer"
              label={t('cards:answer')}
              placeholder={t('cards:answerPlaceholder')}
              required
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<CreateCardDto>
              name="source"
              label={t('cards:source')}
              placeholder={t('cards:sourcePlaceholder')}
              required
            />
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
              disabled={createCardForm.isSubmitting || !createCardForm.isValid}
              loading={createCardForm.isSubmitting}
            >
              {t('cards:createCard')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  )
})
