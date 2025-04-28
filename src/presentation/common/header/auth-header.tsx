import { useState } from 'react'
import { useNavigate } from 'react-router'
import { styled } from '@mui/material/styles'
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

import type { Authenticate } from '@/application'

import { Symbols } from '@/di'
import { useService } from '@/di/provider'

import { root } from '../../core/react-router'

const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
}))

interface AuthHeaderProps {
  notificationCount?: number
  username?: string
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({
  notificationCount = 0,
  username = '',
}) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const authenticate = useService<Authenticate>(Symbols.Authenticate)

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
      await authenticate.logout()
      navigate(root['sign-in'].$path())
    }
    catch (error) {
      console.error('Logout failed:', error)
    }
    handleClose()
  }

  // Get first letter for avatar
  const avatarLetter = username ? username.charAt(0).toUpperCase() : 'D'

  return (
    <AppBar position="static" color="default" elevation={0}>
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
          Dolphy
        </Typography>

        <CenteredNavigation>
          {/* В будущем здесь могут быть пункты навигации */}
        </CenteredNavigation>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Tooltip title="Notifications">
            <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
              <Badge badgeContent={notificationCount} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Tooltip title="Account settings">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}>
                {avatarLetter}
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
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
