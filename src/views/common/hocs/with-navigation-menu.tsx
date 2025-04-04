import React from 'react'

import { BottomNavigation } from '@/views/navigation/bottom-navigation-menu'

/**
 * Higher-Order Component that wraps any component with the BottomNavigation
 *
 * @param Component - The component to wrap
 * @returns A new component with BottomNavigation
 */
export function withBottomNavigation<P extends object>(
  Component: React.ComponentType<P>,
) {
  const WithBottomNav = (props: P & JSX.IntrinsicAttributes) => {
    return (
      <>
        <Component {...props} />
        <BottomNavigation />
      </>
    )
  }

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component'
  WithBottomNav.displayName = `withBottomNavigation(${displayName})`

  return WithBottomNav
}
