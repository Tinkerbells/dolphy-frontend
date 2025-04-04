import type { ComponentType } from 'react'

import React from 'react'

import { useContainer } from './provider'

/**
 * HOC for dependency injection with improved typing
 *
 * @param Component - The component to inject dependencies into
 * @param dependencyMap - Object mapping prop names to DI container symbols
 * @returns Component with injected dependencies
 */
export function withDependencies<
  P extends object,
  K extends keyof P = never,
>(
  Component: ComponentType<P>,
  dependencyMap: { [key in K]: symbol },
): React.FC<Omit<P, K>> {
  // Create the wrapped component
  const WithDependencies = (props: Omit<P, K>) => {
    const container = useContainer()
    const dependencies: Partial<Pick<P, K>> = {} as any

    // Resolve dependencies from container
    for (const [propName, symbol] of Object.entries(dependencyMap)) {
      dependencies[propName as K] = container.get(symbol as symbol) as any
    }

    // Combine dependencies with props and pass to the component
    const allProps = { ...dependencies, ...props } as P
    return <Component {...allProps} />
  }

  const displayName = Component.displayName || Component.name || 'Component'
  WithDependencies.displayName = `withDependencies(${displayName})`

  return WithDependencies
}
