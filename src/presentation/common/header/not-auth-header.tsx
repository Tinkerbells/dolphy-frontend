import { useNavigate } from 'react-router'
import { styled } from '@mui/material/styles'
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
  useTheme,
} from '@mui/material'

import { root } from '../../core/react-router'

const CenteredNavigation = styled(Box)(() => ({
  flexGrow: 1,
  display: 'flex',
  justifyContent: 'center',
}))

export const NotAuthHeader: React.FC = () => {
  const theme = useTheme()
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
          sx={{
            fontWeight: 'bold',
            color: theme.palette.primary.main,
            mr: 2,
          }}
        >
          Dolphy
        </Typography>

        <CenteredNavigation>
          {/* Центрированный контент может быть добавлен позже */}
        </CenteredNavigation>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSignIn}
            size="small"
          >
            Sign In
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSignUp}
            size="small"
          >
            Sign Up
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
