import { Button, Stack } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { SwipeDirection } from '@/common'

interface StudySwiperControlsProps {
  swipe: (direction: SwipeDirection) => Promise<void> | void | undefined
  disabled: boolean
}

export function StudySwiperControls({ swipe, disabled }: StudySwiperControlsProps) {
  const { t } = useTranslation()
  return (
    <Stack direction="row" spacing={2} justifyContent="center" mb={3}>
      <Button
        variant="contained"
        color="error"
        size="large"
        onClick={() => swipe('left')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.again')}
      </Button>

      <Button
        variant="contained"
        color="warning"
        size="large"
        onClick={() => swipe('down')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.hard')}
      </Button>

      <Button
        variant="contained"
        color="success"
        size="large"
        onClick={() => swipe('right')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.good')}
      </Button>

      <Button
        variant="contained"
        color="info"
        size="large"
        onClick={() => swipe('up')}
        disabled={disabled}
        sx={{ minWidth: 100 }}
      >
        {t('cards:rating.easy')}
      </Button>
    </Stack>
  )
}
