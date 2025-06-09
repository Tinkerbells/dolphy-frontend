import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { FormProvider } from 'react-hook-form'
import { Box, Button, Grid } from '@mui/material'

import { FormTextInput } from '@/common'

import type { AuthEmailLoginDto } from '../../../models/dto/auth-email-login.dto'

interface SignInFormProps {
  signInForm: MobxForm<AuthEmailLoginDto>
}

export const SignInForm = observer(({ signInForm }: SignInFormProps) => {
  const { t } = useTranslation(['auth', 'validation'])

  const { originalForm } = signInForm

  return (
    <FormProvider {...originalForm} formState={{ ...signInForm }}>
      <Box
        component="form"
        onSubmit={signInForm.submit}
        sx={{
          maxWidth: 400,

        }}
      >
        <Grid container spacing={2} mb={2} sx={{ marginTop: 3 }}>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<AuthEmailLoginDto>
              name="email"
              label={t('auth:signIn.email')}
              type="email"
              testId="email"
              autoFocus
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<AuthEmailLoginDto>
              name="password"
              label={t('auth:signIn.password')}
              type="password"
              testId="password"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={signInForm.isSubmitting || !signInForm.isValid}
              loading={signInForm.isSubmitting}
            >
              {t('auth:signIn.submit')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  )
})
