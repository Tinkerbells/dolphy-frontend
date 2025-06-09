import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { IconButton, Tooltip } from '@mui/material'
import { useColorScheme } from '@mui/material/styles'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import SettingsBrightnessIcon from '@mui/icons-material/SettingsBrightness'

import { themeService } from '@/common/services'

function getThemeIcon(mode: 'light' | 'dark' | 'system') {
  switch (mode) {
    case 'light':
      return <LightModeIcon />
    case 'dark':
      return <DarkModeIcon />
    case 'system':
      return <SettingsBrightnessIcon />
  }
}

function getThemeLabel(mode: 'light' | 'dark' | 'system') {
  switch (mode) {
    case 'light':
      return 'Light theme'
    case 'dark':
      return 'Dark theme'
    case 'system':
      return 'System theme'
  }
}

export const ThemeSwitcher = observer(() => {
  const { setMode, mode } = useColorScheme()
  const [mounted, setMounted] = useState(false)

  // Necessary for server-side rendering
  useEffect(() => {
    setMounted(true)
  }, [])

  // Sync MUI mode with our theme service when theme service changes
  useEffect(() => {
    if (mounted && setMode && mode !== themeService.effectiveMode) {
      setMode(themeService.effectiveMode)
    }
  }, [themeService.effectiveMode, setMode, mode, mounted])

  const handleToggle = () => {
    themeService.toggleMode()
  }

  if (!mounted) {
    return null
  }

  return (
    <Tooltip title={getThemeLabel(themeService.mode)}>
      <IconButton
        onClick={handleToggle}
        size="small"
        aria-label={`Switch to next theme mode. Current: ${themeService.mode}`}
      >
        {getThemeIcon(themeService.mode)}
      </IconButton>
    </Tooltip>
  )
})
