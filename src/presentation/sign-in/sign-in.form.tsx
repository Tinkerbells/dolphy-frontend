import { observer } from 'mobx-react-lite'
import { Controller } from 'react-hook-form'
import { useMobxForm } from 'mobx-react-hook-form'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material'

import { SYMBOLS } from '@/di/symbols'
import { useService } from '@/di/provider'

import type { SignInStore } from './sign-in.store'

import styles from './sign-in.module.css'

export const SignInForm = observer(() => {
  const signInStore = useService<SignInStore>(SYMBOLS.SignInStore)

  const form = useMobxForm(signInStore.signInForm)

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
            type={signInStore.showPassword ? 'text' : 'password'}
            fullWidth
            margin="normal"
            error={!!error}
            helperText={error?.message}
            autoComplete="current-password"
            id="password"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={signInStore.togglePasswordVisibility}
                    edge="end"
                  >
                    {signInStore.showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
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
})
