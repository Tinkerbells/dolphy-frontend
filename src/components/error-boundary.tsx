import type { ComponentType, GetDerivedStateFromError, PropsWithChildren, ReactNode } from 'react'

import {
  Component,

} from 'react'

export interface ErrorBoundaryProps extends PropsWithChildren {
  fallback?: ReactNode | ComponentType<{ error: unknown }>
}

interface ErrorBoundaryState {
  error?: unknown
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = {}

  static getDerivedStateFromError: GetDerivedStateFromError<ErrorBoundaryProps, ErrorBoundaryState> = error => ({ error })

  componentDidCatch(error: Error) {
    this.setState({ error })
  }

  render() {
    const {
      state: {
        error,
      },
      props: {
        fallback: Fallback,
        children,
      },
    } = this

    return 'error' in this.state
      ? typeof Fallback === 'function'
        ? <Fallback error={error} />
        : Fallback
      : children
  }
}
