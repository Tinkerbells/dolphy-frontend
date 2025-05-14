import { useState } from 'react'
import { useNavigate } from 'react-router'
import { observer } from 'mobx-react-lite'
import { styled } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import LogoutIcon from '@mui/icons-material/Logout'
import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'

import { root } from '../../navigation/routes'
import { LanguageSwitcher } from '../language-switcher'

const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
}))

interface AuthHeaderProps {
  notificationCount?: number
}

export const AuthHeader: React.FC<AuthHeaderProps> = observer(({
  notificationCount = 0,
}) => {
  const { t } = useTranslation(['common', 'auth'])
  const theme = useTheme()
  const navigate = useNavigate()
  // const { profile, logout } = useService<ProfileStore>(Symbols.ProfileStore)

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    try {
      // await logout.mutate()
      navigate(root['sign-in'].$path())
    }
    catch (error) {
      console.error('Logout failed:', error)
    }
    handleClose()
  }

  return (
    <AppBar position="fixed" color="default" elevation={0}>
      <Toolbar sx={{ padding: 1 / 2 }}>
        {/* Logo/Brand */}
        <Typography
          variant="h6"
          component="div"
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mr: 2,
          }}
        >
          {t('app.name')}
        </Typography>

        <CenteredNavigation>
          {/* Навигационные элементы могут быть добавлены здесь */}
        </CenteredNavigation>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />

          <Tooltip title={t('navigation.notifications', 'Notifications')}>
            <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title={t('navigation.settings', 'Account settings')}>
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              {/* {!profile.result.data && profile.result.isFetching */}
              {/*   ? <Skeleton variant="circular" width={36} height={36} /> */}
              {/*   : ( */}
              {/**/}
              {/*       <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}> */}
              {/*         {profile.result.data?.firstChar} */}
              {/*       </Avatar> */}
              {/*     )} */}
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}>
                U
              </Avatar>
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
