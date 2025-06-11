import { useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Box,
  Button,
  Link,
  Toolbar,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import { ThemeSwitcher } from '../theme-switcher'
import { LanguageSwitcher } from '../language-switcher'

export const NotAuthHeader: React.FC = () => {
  const { t } = useTranslation(['common', 'auth'])
  const navigate = useNavigate()

  const handleSignIn = () => {
    navigate(root['sign-in'].$path())
  }

  const handleSignUp = () => {
    navigate(root['sign-up'].$path())
  }

  return (
    <AppBar position="static" color="default" elevation={0}>
      <Toolbar sx={{ padding: 1 / 2 }}>
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageSwitcher />
          <ThemeSwitcher />
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSignIn}
            size="small"
          >
            {t('auth:signIn.submit')}
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            size="small"
          >
            {t('auth:signUp.submit')}
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
