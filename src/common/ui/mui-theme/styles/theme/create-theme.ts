import { createTheme as extendTheme } from '@mui/material/styles'

import { shadows } from './shadows'
import { typography } from './typography'
import { colorSchemes } from './color-schemes'
import { components } from './components/components'

export function createTheme() {
  const theme = extendTheme({
    breakpoints: { values: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1440 } },
    components,
    cssVariables: {
      colorSchemeSelector: 'class',
    },
    // colorSchemes: {
    //   light: colorSchemes.light,
    //   dark: colorSchemes.dark,
    // },
    shadows,
    shape: { borderRadius: 8 },
    typography,
  })

  return theme
}
