import type {
  LinkProps as RouterLinkProps,
} from 'react-router'

import * as React from 'react'
import {
  Link as RouterLink,
} from 'react-router'

export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  Omit<RouterLinkProps, 'to'> & { href: RouterLinkProps['to'] }
>((props, ref) => {
  const { href, ...other } = props
  return <RouterLink data-testid="custom-link" ref={ref} to={href} {...other} />
})
