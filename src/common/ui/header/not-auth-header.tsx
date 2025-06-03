import { useNavigate } from 'react-router'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import { LanguageSwitcher } from '../language-switcher'

const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
}))

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
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component="div"
          sx={theme => ({
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mr: 2,
          })}
        >
          {t('app.name')}
        </Typography>

        <CenteredNavigation>
          {/* Центрированный контент может быть добавлен позже */}
        </CenteredNavigation>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LanguageSwitcher />
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
