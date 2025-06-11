import { observer } from 'mobx-react-lite'
import { useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HomeIcon from '@mui/icons-material/Home'
import StoreIcon from '@mui/icons-material/Store'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Skeleton,
  Tab,
  Tabs,
  Toolbar,
  Tooltip,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import { profile } from './external'
import { ThemeSwitcher } from '../theme-switcher'
import { LanguageSwitcher } from '../language-switcher'

export const AuthHeader = observer(() => {
  const { logout, isLoading, user } = profile
  const { t } = useTranslation(['common', 'auth'])
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [currentTab, setCurrentTab] = useState(0)
  const open = Boolean(anchorEl)
  // TODO: улучшить работу с навигацией в Tabs
  // Define tab routes
  const tabRoutes = [
    { path: root.decks.$path(), value: 0 },
    { path: '/market', value: 1 }, // Update with actual market route
    { path: '/settings', value: 2 }, // Update with actual settings route
  ]

  // Update current tab based on location
  useEffect(() => {
    const currentRoute = tabRoutes.find(route =>
      location.pathname.startsWith(route.path),
    )
    if (currentRoute) {
      setCurrentTab(currentRoute.value)
    }
  }, [location.pathname])

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue)
    // Navigate to the corresponding route
    const targetRoute = tabRoutes.find(route => route.value === newValue)
    if (targetRoute) {
      window.location.href = targetRoute.path
    }
  }

  return (
    <AppBar position="fixed" color="default" elevation={0}>
      <Toolbar sx={{
        padding: 1 / 2,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
      }}
      >
        {/* Empty left spacer */}
        <Box />
        <Box sx={{
          flexGrow: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        >
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            aria-label="navigation tabs"
            sx={{
              '& .MuiTab-root': {
                fontWeight: 500,
                textTransform: 'none',
                minWidth: 'auto',
                padding: '12px 24px',
                transition: 'color 0.4s ease-in-out',
              },
              '& .MuiTabs-indicator': {
                backgroundColor: 'primary.main',
              },
            }}
          >
            <Tab
              icon={<HomeIcon fontSize="medium" />}
              label="Home"
              iconPosition="start"
              sx={{
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
            <Tab
              icon={<StoreIcon fontSize="medium" />}
              label="Market"
              iconPosition="start"
              sx={{
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
            <Tab
              icon={<SettingsIcon fontSize="medium" />}
              label="Settings"
              iconPosition="start"
              sx={{
                '&.Mui-selected': {
                  color: 'primary.main',
                },
              }}
            />
          </Tabs>
        </Box>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifySelf: 'end',
        }}
        >
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
