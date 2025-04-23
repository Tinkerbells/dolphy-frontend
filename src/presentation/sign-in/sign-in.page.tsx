import { Google } from '@mui/icons-material'
import {
  Box,
  Button,
  Card,
  Divider,
  Typography,
} from '@mui/material'

import { Link } from '@/components/Link/Link'

import { SignInForm } from './sign-in.form'

export function SignInPage() {
  // Обработчик входа через Google
  const handleGoogleSignIn = () => {
    // Логика для аутентификации через Google
    console.log('Google sign-in clicked')
  }

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Card variant="outlined" sx={{ padding: 4, minWidth: 450 }}>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign in
        </Typography>
        <Box>
          <SignInForm />

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
              <Link to="/sign-up" style={{ color: 'primary.main', textDecoration: 'none' }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
