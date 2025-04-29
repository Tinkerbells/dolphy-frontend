import {
  Box,
} from '@mui/material'

import { Symbols } from '@/di'
import { useService } from '@/di/provider'

import type { ProfileStore } from '../profile'

export function DecksPage() {
  const { profile } = useService<ProfileStore>(Symbols.ProfileStore)

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {profile?.result.data?.fullName}
    </Box>
  )
}
