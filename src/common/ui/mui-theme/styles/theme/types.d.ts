import type { Theme as MuiTheme } from '@mui/material/styles'

export type Theme = MuiTheme

export type ColorScheme = 'dark' | 'light'

// Augment the Material-UI theme to include custom palette colors
declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary']
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary']
  }
}
