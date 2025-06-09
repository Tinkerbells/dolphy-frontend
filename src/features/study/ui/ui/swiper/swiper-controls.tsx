import { useTranslation } from 'react-i18next'
import { Button, Stack, Typography } from '@mui/material'

import type { SwipeDirection } from '@/common'

interface StudySwiperControlsProps {
  swipe: (direction: SwipeDirection) => void | undefined
  disabled: boolean
}

export function StudySwiperControls({ swipe, disabled }: StudySwiperControlsProps) {
  const { t } = useTranslation()
  return (
    <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
      <Button
        variant="contained"
        color="error"
        onClick={() => swipe('left')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.again')}
        <Typography variant="caption" sx={{ ml: 1 }}>
          (1)
        </Typography>
      </Button>

      <Button
        variant="contained"
        color="warning"
        onClick={() => swipe('down')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.hard')}
        <Typography variant="caption" sx={{ ml: 1 }}>
          (2)
        </Typography>
      </Button>

      <Button
        variant="contained"
        color="success"
        onClick={() => swipe('right')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.good')}
        <Typography variant="caption" sx={{ ml: 1 }}>
          (3)
        </Typography>
      </Button>

      <Button
        variant="contained"
        color="info"
        onClick={() => swipe('up')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.easy')}
        <Typography variant="caption" sx={{ ml: 1 }}>
          (4)
        </Typography>
      </Button>
    </Stack>
  )
}
