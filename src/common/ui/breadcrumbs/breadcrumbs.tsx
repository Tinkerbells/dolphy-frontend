import type { LinkProps as RouterLinkProps } from 'react-router'
import type { ChipProps, BreadcrumbsProps as MuiBreadcrumbsProps } from '@mui/material'

import { useNavigate } from 'react-router'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  Box,
  Chip,
  emphasize,
  IconButton,
  Breadcrumbs as MuiBreadcrumbs,
  styled,
} from '@mui/material'

import { LinkBehavior } from '../link'

export interface BreadcrumbItem {
  icon?: ChipProps['icon']
  label: ChipProps['label']
  href?: RouterLinkProps['to']
}

export interface BreadcrumbsProps extends Omit<MuiBreadcrumbsProps, 'children'> {
  items: BreadcrumbItem[]
  backButton?: boolean
  onBackButtonClick?: () => void
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  return {
    'backgroundColor': theme.palette.grey[100],
    'height': theme.spacing(3),
    'color': (theme.cssVariables || theme).palette.text.primary,
    'fontWeight': theme.typography.fontWeightRegular,
    '&:hover, &:focus': {
      backgroundColor: emphasize(theme.palette.grey[100], 0.06),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.06),
      }),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(theme.palette.grey[100], 0.12),
      ...theme.applyStyles('dark', {
        backgroundColor: emphasize(theme.palette.grey[800], 0.12),
      }),
    },
    ...theme.applyStyles('dark', {
      backgroundColor: theme.palette.grey[800],
    }),
  }
}) as typeof Chip

export function Breadcrumbs({
  items,
  backButton = true,
  onBackButtonClick,
  ...rest
}: BreadcrumbsProps) {
  const navigate = useNavigate()

  return (
    <Box
      display="flex"
      alignItems="center"
      sx={{ my: 2 }}
      {...rest}
    >
      {backButton && (
        <IconButton
          onClick={onBackButtonClick ?? (() => navigate(-1))}
          sx={{ mr: 1, p: 0.5 }}
          size="small"
          aria-label="Go back"
        >
          <ArrowBackIcon />
        </IconButton>
      )}

      <MuiBreadcrumbs aria-label="breadcrumb">
        {items.map((item, i) => {
          const { href, ...chipProps } = item
          return (
            <StyledBreadcrumb
              key={`breadcrumb-item-${i}`}
              {...chipProps}
              {...(href && {
                component: LinkBehavior,
                href,
                clickable: true,
              })}
            />
          )
        })}
      </MuiBreadcrumbs>
    </Box>
  )
}
