import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Google, Visibility, VisibilityOff } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Typography,
} from '@mui/material'

import { Form } from '@/views/ui/form'
import { Link } from '@/components/Link/Link'

import styles from './sign-in.styles.module.css'

// Define form schema with validation
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Form data type
type SignInFormData = z.infer<typeof signInSchema>

export function SignInPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Initialize form with react-hook-form
  const methods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Handle form submission
  const onSubmit = async (data: SignInFormData) => {
    setError('')
    setLoading(true)

    try {
      console.log(data)
      // const result = await signIn({ email: data.email, password: data.password })
      // if (result.success) {
      //   router.push('/dashboard')
      // }
      // else {
      //   setError(result.error || 'Failed to sign in')
      // }
    }
    catch (err) {
      setError('An unexpected error occurred')
    }
    finally {
      setLoading(false)
    }
  }

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    setError('')
    setLoading(true)

    try {
      console.log(data)
      // const result = await signIn({ provider: 'google' })
      // if (result.success) {
      //   router.push('/dashboard')
      // }
      // else {
      //   setError(result.error || 'Failed to sign in with Google')
      // }
    }
    catch (err) {
      setError('An unexpected error occurred')
    }
    finally {
      setLoading(false)
    }
  }

  // Create sign-in form using Form Builder
  const LoginForm = new Form(methods, {
    submitText: 'Sign In',
    onSubmit,
  })
    .input('email', {
      required: true,
      fullWidth: true,
      id: 'email',
      label: 'Email Address',
      autoComplete: 'email',
      autoFocus: true,
      margin: 'normal',
      sx: { mb: 2 },
    })
    .input('password', {
      required: true,
      fullWidth: true,
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      id: 'password',
      autoComplete: 'current-password',
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      },
    })
    .build()

  return (
    <Box sx={{ width: '100%' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <LoginForm className={styles.loginForm} />

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress size={24} />
        </Box>
      )}

      <Divider sx={{ my: 2 }}>or</Divider>

      <Button
        fullWidth
        variant="outlined"
        startIcon={<Google />}
        onClick={handleGoogleSignIn}
        sx={{ mb: 3, py: 1.5 }}
        disabled={loading}
      >
        Sign in with Google
      </Button>

      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Don't have an account?
          {' '}
          <Link to="/sign-up" style={{ color: 'primary.main', textDecoration: 'none' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Box>
  )
}
