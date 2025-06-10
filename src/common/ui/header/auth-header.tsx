import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
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
} from '@mui/material'

import { profile } from './external'
import { ThemeSwitcher } from '../theme-switcher'
import { LanguageSwitcher } from '../language-switcher'

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
        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
          <ThemeSwitcher />
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
