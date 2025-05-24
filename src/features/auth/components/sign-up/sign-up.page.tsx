import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Google } from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import {
  Box,
  Button,
  Card,
  Divider,
  Link,
  Typography,
} from '@mui/material'

import { useInjected } from '@/core/presentation/react'
import { root } from '@/core/presentation/navigation/routes'

import { SignUpForm } from './sign-up.form'
import { SignUpStore } from './sign-up.store'

export function SignUpPage() {
  const { t } = useTranslation(['auth', 'common'])
  const navigate = useNavigate()
  const store = useInjected<SignUpStore>(SignUpStore)

  useEffect(() => {
    if (store.register.result.isSuccess) {
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
          {t('auth:signUp.title')}
        </Typography>

        <Box>
          <SignUpForm
            signUpForm={store.signUpForm}
          />

          <Divider sx={{ my: 2 }}>{t('auth:signUp.or')}</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 3, py: 1.5 }}
          >
            {t('auth:signUp.signInWithGoogle')}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth:signUp.haveAccount')}
              {' '}
              <Link
                href="/sign-in"
                style={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {t('auth:signUp.signIn')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
}
