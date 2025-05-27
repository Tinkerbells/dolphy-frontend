import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import { FormProvider } from 'react-hook-form'
import { Box, Button, Container, Grid } from '@mui/material'

import type { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'

import { FormTextInput } from '@/shared'

import styles from './sign-in.module.css'

interface SignInFormProps {
  signInForm: MobxForm<AuthEmailLoginDto>
}

export const SignInForm = observer(({ signInForm }: SignInFormProps) => {
  const { t } = useTranslation(['auth', 'validation'])

  const { originalForm } = signInForm

  // const fields: FormConfig<AuthEmailLoginDto>[] = [
  //   {
  //     type: 'text',
  //     config: {
  //       control: {
  //         name: 'email',
  //         label: t('auth:signIn.email'),
  //       },
  //       textFieldProps: {
  //         margin: 'normal',
  //         autoComplete: 'email',
  //         type: 'email',
  //         id: 'email',
  //       },
  //     },
  //   },
  //   {
  //     type: 'text',
  //     config: {
  //       control: {
  //         name: 'password',
  //         label: t('auth:signIn.password'),
  //       },
  //       textFieldProps: {
  //         fullWidth: true,
  //         margin: 'normal',
  //         type: 'password',
  //       },
  //     },
  //   },
  // ]

  return (
    <FormProvider {...originalForm} formState={{ ...signInForm }}>
      <Box className={styles.signInForm} component="form" onSubmit={signInForm.submit}>
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
          <Box sx={{ mt: 3 }}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={signInForm.isSubmitting || !signInForm.isValid}
            >
              {signInForm.isSubmitting ? t('common:loading') : t('auth:signIn.submit')}
            </Button>
          </Box>
        </Grid>
      </Box>
    </FormProvider>
  )
})
