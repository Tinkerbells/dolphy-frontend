import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Google } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  Typography,
} from '@mui/material'

import { SYMBOLS } from '@/di/symbols'
import { useService } from '@/di/provider'

import type { SignInStore } from './sign-in.store'

import { SignInForm } from './sign-in.form'

export const SignInPage = observer(() => {
  const store = useService<SignInStore>(SYMBOLS.SignInStore)
  // Google auth handler
  const handleGoogleSignIn = () => {
    // TODO: replace with real Google auth logic
    console.log('Google sign‑in clicked')
  }

  useEffect(() => {
    if (store.login.result.isSuccess) {
      console.log('Success')
    }
  }, [store.login.result.isSuccess])

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
          Sign in
        </Typography>

        <Box>
          <SignInForm signInForm={store.signInForm} />

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 3, py: 1.5 }}
            onClick={handleGoogleSignIn}
          >
            Sign in with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?
              {' '}
              <Link
                href="/sign-up"
                style={{ color: 'primary.main', textDecoration: 'none' }}
              >
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
})
