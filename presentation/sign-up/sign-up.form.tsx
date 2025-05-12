import type { MobxForm } from 'mobx-react-hook-form'

import { Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useMobxForm } from 'mobx-react-hook-form'
import {
  Box,
  Button,
  TextField,
} from '@mui/material'

interface SignUpFormProps {
  signUpForm: MobxForm<AuthRegisterLoginDto, any, AuthRegisterLoginDto>
}

export function SignUpForm({ signUpForm }: SignUpFormProps) {
  const { t } = useTranslation(['auth', 'validation'])
  const form = useMobxForm(signUpForm)

  return (
    <form onSubmit={form.onSubmit} className={styles.signUpForm}>
      <Controller
        name="firstName"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={t('signUp.firstName')}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message && t(error.message, { ns: 'validation', defaultValue: error.message })}
            autoFocus
            id="firstName"
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="lastName"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={t('signUp.lastName')}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message && t(error.message, { ns: 'validation', defaultValue: error.message })}
            id="lastName"
            sx={{ mb: 2 }}
          />
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label={t('signUp.email')}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message && t(error.message, { ns: 'validation', defaultValue: error.message })}
            autoComplete="email"
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
            label={t('signUp.password')}
            type="password"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message && t(error.message, { ns: 'validation', defaultValue: error.message })}
            autoComplete="new-password"
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
          {form.formState.isSubmitting ? t('common:common.loading') : t('signUp.submit')}
        </Button>
      </Box>
    </form>
  )
}
