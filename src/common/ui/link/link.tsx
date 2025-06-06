import type { LinkProps as MuiLinkProps } from '@mui/material'
import type {
  LinkProps as RouterLinkProps,
} from 'react-router'

import * as React from 'react'
import { Link as MuiLink } from '@mui/material'
import {
  Link as RouterLink,
} from 'react-router'

/**
 * Пропсы для LinkBehavior - принимает все RouterLink пропсы + href вместо to
 */
export interface LinkBehaviorProps extends Omit<RouterLinkProps, 'to'> {
  href: RouterLinkProps['to']
}

/**
 * Router-specific props that we want to support
 */
type RouterSpecificProps = Pick<RouterLinkProps, | 'state'
  | 'replace'
  | 'preventScrollReset'
  | 'relative'
  | 'reloadDocument'>

/**
 * Пропсы для Link - объединяет MUI и Router пропсы
 * Приоритет отдается MUI пропсам в случае конфликтов
 */
export interface LinkProps extends
  Omit<MuiLinkProps, 'href' | 'component'>,
  RouterSpecificProps {
  href: RouterLinkProps['to']
}

/**
 * Адаптер Router Link для Material-UI
 */
export const LinkBehavior = React.forwardRef<
  HTMLAnchorElement,
  LinkBehaviorProps
>((props, ref) => {
  const { href, ...routerProps } = props
  return (
    <RouterLink
      data-testid="custom-link"
      ref={ref}
      to={href}
      {...routerProps}
    />
  )
})

/**
 * Кастомный Link компонент
 */
export const Link = React.forwardRef<
  HTMLAnchorElement,
  LinkProps
>((props, ref) => {
  // Разделяем MUI пропсы и Router пропсы
  const {
    // Router пропсы
    href,
    state,
    replace,
    preventScrollReset,
    relative,
    reloadDocument,
    // MUI пропсы (все остальное)
    ...muiProps
  } = props

  // Router пропсы для LinkBehavior
  const routerProps: LinkBehaviorProps = {
    href,
    state,
    replace,
    preventScrollReset,
    relative,
    reloadDocument,
  }

  return (
    <MuiLink
      component={LinkBehavior}
      ref={ref}
      {...routerProps}
      {...muiProps}
    />
  )
})

LinkBehavior.displayName = 'LinkBehavior'
Link.displayName = 'Link'
