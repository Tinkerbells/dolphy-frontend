import type { MobxForm } from 'mobx-react-hook-form'

import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMobxForm } from 'mobx-react-hook-form'
import {
  Box,
  Button,
  TextField,
} from '@mui/material'

import type { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'

import styles from './sign-in.module.css'

interface SignInFormProps {
  signInForm: MobxForm<AuthEmailLoginDto, any, AuthEmailLoginDto>
}

export function SignInForm({ signInForm }: SignInFormProps) {
  const { t } = useTranslation(['auth', 'validation'])
  const form = useMobxForm(signInForm)

  return (
    <form onSubmit={form.onSubmit} className={styles.signInForm}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={t('signIn.email')}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message && t(error.message, { ns: 'validation', defaultValue: error.message })}
            autoComplete="email"
            autoFocus
            id="email"
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={t('signIn.password')}
            type="password"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message && t(error.message, { ns: 'validation', defaultValue: error.message })}
            autoComplete="current-password"
            id="password"
          />
        )}
      />

      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
        >
          {form.formState.isSubmitting ? t('common:common.loading') : t('signIn.submit')}
        </Button>
      </Box>
    </form>
  )
}
