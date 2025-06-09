import type { Components } from '@mui/material/styles'

import type { Theme } from '../types'

import { MuiTab } from './tab'
import { MuiCard } from './card'
import { MuiLink } from './link'
import { MuiStack } from './stack'
import { MuiAvatar } from './avatar'
import { MuiButton } from './button'
import { MuiTableBody } from './table-body'
import { MuiTableCell } from './table-cell'
import { MuiTableHead } from './table-head'
import { MuiCardHeader } from './card-header'
import { MuiCardContent } from './card-content'

export const components = {
  MuiAvatar,
  MuiButton,
  MuiCard,
  MuiCardContent,
  MuiCardHeader,
  MuiLink,
  MuiStack,
  MuiTab,
  MuiTableBody,
  MuiTableCell,
  MuiTableHead,
} satisfies Components<Theme>
