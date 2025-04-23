import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Google } from '@mui/icons-material'
import { useResolve } from '@wox-team/wox-inject'
import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  Typography,
} from '@mui/material'

import { root } from '@/lib/react-router'

import { SignUpForm } from './sign-up.form'
import { SignUpStore } from './sign-up.store'

export function SignUpPage() {
  const navigate = useNavigate()
  const store = useResolve(SignUpStore)

  // Google auth handler
  const handleGoogleSignUp = () => {
    // TODO: replace with real Google auth logic
    console.log('Google sign‑up clicked')
  }

  useEffect(() => {
    if (store.register.result.isSuccess) {
      // Навигация на страницу входа после успешной регистрации
      navigate(root['sign-in'].$path())
    }
  }, [store.register.result.isSuccess, navigate])

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Card variant="outlined" sx={{ p: 4, minWidth: 450 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign up
        </Typography>

        <Box>
          <SignUpForm
            signUpForm={store.signUpForm}
          />

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 3, py: 1.5 }}
            onClick={handleGoogleSignUp}
          >
            Sign up with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?
              {' '}
              <Link
                href="/sign-in"
                style={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
