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

import { SignUpForm } from './ui'
import { signUpController } from '../../controllers/sign-up.controller'

export const SignUpPage = observer(() => {
  const { t } = useTranslation(['auth', 'common'])

  const { signUpForm } = signUpController

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
          <SignUpForm signUpForm={signUpForm} />

          <Divider sx={{ my: 2 }}>{t('auth:signUp.or')}</Divider>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            sx={{ mb: 3, py: 1.5 }}
          >
            {t('auth:signUp.signUpWithGoogle')}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('auth:signUp.haveAccount')}
              {' '}
              <Link
                href={root['sign-in'].$path()}
                style={{ color: 'primary.main', textDecoration: 'none' }}
              >
                {t('signUp.signIn')}
              </Link>
            </Typography>
          </Box>
        </Box>
      </Card>
    </Box>
  )
})
