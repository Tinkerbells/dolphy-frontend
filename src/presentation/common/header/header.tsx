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

const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
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

        <CenteredNavigation>
        </CenteredNavigation>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton size="large" color="inherit" sx={{ mr: 1 }}>
            <Badge badgeContent={notificationCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 36, height: 36 }}>
            D
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
