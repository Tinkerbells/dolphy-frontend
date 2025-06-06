import { createTheme } from '@mui/material'

import { LinkBehavior } from '../link'

export const theme = createTheme({
  components: {
    MuiButtonBase: {
      defaultProps: {
        LinkComponent: LinkBehavior,
      },
    },
  },
})
