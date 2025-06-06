import type { ComponentType } from 'react'

import type { BreadcrumbsProps } from './breadcrumbs'

import { Breadcrumbs } from './breadcrumbs'

export function withBreadcrumbs<P extends object>(
  Component: ComponentType<P>,
  { className, ...options }: BreadcrumbsProps,
) {
  const WithBreadcrumbs = (props: P) => {
    return (
      <>
        <Breadcrumbs {...options} />
        <Component {...(props as P)} />
      </>
    )
  }

  const componentName = Component.displayName || Component.name || 'Component'
  WithBreadcrumbs.displayName = `withBreadcrumbs(${componentName})`

  return WithBreadcrumbs
}
