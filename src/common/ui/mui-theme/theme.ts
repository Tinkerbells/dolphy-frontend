import type { LinkProps } from '@mui/material'

import { createTheme } from '@mui/material'

import { LinkBehavior } from '../link'

export const theme = createTheme({
  components: {
    MuiLink: {
      defaultProps: {
        component: LinkBehavior,
      } as LinkProps,
    },
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})
