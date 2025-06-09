import { extendTheme } from '@mui/material/styles'

import { LinkBehavior } from '../link'
import { createTheme as createCustomTheme } from './styles/theme/create-theme'

const baseTheme = createCustomTheme()

export const theme = extendTheme(baseTheme, {
  components: {
    ...baseTheme.components,
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})
