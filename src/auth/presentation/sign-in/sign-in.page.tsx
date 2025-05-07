import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Google } from '@mui/icons-material'
import { getModuleContainer } from 'inversiland'
import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  Typography,
} from '@mui/material'

import AppModule from '@/app-module'
import { AuthModule } from '@/auth/auth-module'

import { SignInStore, SignInStoreToken } from './sign-in.store'

export function SignInPage() {
  const navigate = useNavigate()

  const container = getModuleContainer(AppModule)

  console.log(container.isProvided(SignInStore))

  // useEffect(() => {
  //   if (store.login.result.isSuccess) {
  //     navigate(root.decks.$path())
  //   }
  // }, [store.login.result.isSuccess])

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
          {/* <SignInForm signInForm={store.signInForm} /> */}

          <Divider sx={{ my: 2 }}>or</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 3, py: 1.5 }}
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
}
