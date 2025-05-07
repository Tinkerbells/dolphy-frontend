import React from 'react'

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
      </>
    )
  }

  // Set display name for debugging
  const displayName = Component.displayName || Component.name || 'Component'
  WithBottomNav.displayName = `withBottomNavigation(${displayName})`

  return WithBottomNav
}
