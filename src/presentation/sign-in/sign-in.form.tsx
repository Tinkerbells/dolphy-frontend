import type { MobxForm } from 'mobx-react-hook-form'

import { Controller } from 'react-hook-form'
import { useMobxForm } from 'mobx-react-hook-form'
import {
  Box,
  Button,
  TextField,
} from '@mui/material'

import type { AuthEmailLoginDto } from '@/domain/auth/dto/auth-email-login.dto'

import styles from './sign-in.module.css'

interface SignInFormProps {
  signInForm: MobxForm<AuthEmailLoginDto, any, AuthEmailLoginDto>
}

export function SignInForm({ signInForm }: SignInFormProps) {
  const form = useMobxForm(signInForm)
  return (
    <form onSubmit={form.onSubmit} className={styles.signInForm}>
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="Email Address"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
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
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
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
          {form.formState.isSubmitting ? 'Вход...' : 'Войти'}
        </Button>
      </Box>
    </form>
  )
}
