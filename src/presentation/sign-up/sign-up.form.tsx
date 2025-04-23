import type { MobxForm } from 'mobx-react-hook-form'

import { Controller } from 'react-hook-form'
import { useMobxForm } from 'mobx-react-hook-form'
import {
  Box,
  Button,
  TextField,
} from '@mui/material'

import type { AuthRegisterLoginDto } from '@/domain/auth/dto/auth-register-login.dto'

import styles from './sign-up.module.css'

interface SignUpFormProps {
  signUpForm: MobxForm<AuthRegisterLoginDto, any, AuthRegisterLoginDto>
}

export function SignUpForm({ signUpForm }: SignUpFormProps) {
  const form = useMobxForm(signUpForm)

  return (
    <form onSubmit={form.onSubmit} className={styles.signUpForm}>
      <Controller
        name="firstName"
        control={form.control}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            label="First Name"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
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
            label="Last Name"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
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
            label="Email Address"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
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
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
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
          {form.formState.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </Button>
      </Box>
    </form>
  )
}
