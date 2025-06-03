import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import LogoutIcon from '@mui/icons-material/Logout'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'

import { profile } from './external'
import { LanguageSwitcher } from '../language-switcher'

const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
}))

export const AuthHeader = observer(() => {
  const { logout, isLoading, user, refetch } = profile
  const { t } = useTranslation(['common', 'auth'])

  useEffect(() => {
    refetch()
  }, [])

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    logout()
    handleClose()
  }

  return (
    <AppBar position="fixed" color="default" elevation={0}>
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
          {/* Навигационные элементы могут быть добавлены здесь */}
        </CenteredNavigation>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
          <Tooltip title={t('navigation.settings', 'Account settings')}>
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {!user && isLoading
                ? (
                    <Skeleton variant="circular" width={36} height={36} />
                  )
                : user
                  ? (
                      <Avatar sx={theme => ({ bgcolor: theme.palette.primary.main, width: 36, height: 36 })}>
                        {user.firstChar}
                      </Avatar>
                    )
                  : null}
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            {t('auth:logout.title')}
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
})
