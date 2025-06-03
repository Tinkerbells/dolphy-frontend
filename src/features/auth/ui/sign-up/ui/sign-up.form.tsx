import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { FormProvider } from 'react-hook-form'
import { Box, Button, Grid } from '@mui/material'

import { FormTextInput } from '@/common'

import type { AuthRegisterLoginDto } from '../../../models/dto/auth-register-login.dto'


interface SignUpFormProps {
  signUpForm: MobxForm<AuthRegisterLoginDto>
}

export const SignUpForm = observer(({ signUpForm }: SignUpFormProps) => {
  const { t } = useTranslation(['auth', 'validation'])

  const { originalForm } = signUpForm

  return (
    <FormProvider {...originalForm} formState={{ ...signUpForm }}>
      <Box  component="form" onSubmit={signUpForm.submit} sx={{
        maxWidth: 400
      }}>
        <Grid container spacing={2} mb={2} sx={{ marginTop: 3 }}>
          <Grid size={{ xs: 6 }}>
            <FormTextInput<AuthRegisterLoginDto>
              name="firstName"
              label={t('auth:signUp.firstName')}
              type="text"
              testId="firstName"
              autoFocus
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <FormTextInput<AuthRegisterLoginDto>
              name="lastName"
              label={t('auth:signUp.lastName')}
              type="text"
              testId="lastName"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<AuthRegisterLoginDto>
              name="email"
              label={t('auth:signUp.email')}
              type="email"
              testId="email"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <FormTextInput<AuthRegisterLoginDto>
              name="password"
              label={t('auth:signUp.password')}
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
              disabled={signUpForm.isSubmitting || !signUpForm.isValid}
              loading={signUpForm.isSubmitting}
            >
              {t('auth:signUp.submit')}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </FormProvider>
  )
})
