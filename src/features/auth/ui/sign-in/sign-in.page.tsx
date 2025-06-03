import { observer } from 'mobx-react-lite'
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

import { root } from '@/app/navigation/routes'

import { SignInForm } from './ui'
import { signInController } from '../../controllers/sign-in.controller'

export const SignInPage = observer(() => {
  const { t } = useTranslation(['auth', 'common'])

  const { signInForm } = signInController

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
          {t('auth:signIn.title')}
        </Typography>

        <Box>
          <SignInForm signInForm={signInForm} />

          <Divider sx={{ my: 2 }}>{t('auth:signIn.or')}</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 3, py: 1.5 }}
          >
            {t('auth:signIn.signInWithGoogle')}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth:signIn.noAccount')}
              {' '}
              <Link
                href={root['sign-up'].$path()}
                style={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {t('auth:signIn.signUp')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
})
