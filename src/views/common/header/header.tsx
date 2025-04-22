import { styled } from '@mui/material/styles'
import NotificationsIcon from '@mui/icons-material/Notifications'
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'

// Styled component for the centered navigation
const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
}))

// Styled navigation item to mimic the tab-like behavior
const NavItem = styled(Typography)<{ active?: boolean }>(({ theme, active }) => ({
  'color': active ? theme.palette.primary.main : theme.palette.text.primary,
  'padding': theme.spacing(2),
  'position': 'relative',
  'cursor': 'pointer',
  'fontWeight': active ? 600 : 400,
  '&:after': active
    ? {
        content: '""',
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 2,
        backgroundColor: theme.palette.primary.main,
      }
    : {},
}))

interface CenteredAppBarProps {
  notificationCount?: number
}

export const Header: React.FC<CenteredAppBarProps> = ({ notificationCount = 0 }) => {
  const theme = useTheme()

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

        {/* Centered Navigation */}
        <CenteredNavigation>
          <NavItem active={true}>Home</NavItem>
          <NavItem>Library</NavItem>
        </CenteredNavigation>

        {/* Right-aligned items */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Premium Button */}
          {/* Notification Bell */}
          <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* User Avatar */}
          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}>
            D
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
