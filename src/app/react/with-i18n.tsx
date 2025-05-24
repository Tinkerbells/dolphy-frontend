import React, { Suspense } from 'react'
import { CircularProgress } from '@mui/material'

/**
 * HOC для оборачивания компонентов, использующих i18n, в Suspense
 * @param Component Компонент для обёртывания
 * @returns Обёрнутый компонент
 */
export function withI18n<T extends object>(Component: React.ComponentType<T>) {
  const WrappedComponent = (props: T) => (
    <Suspense fallback={<CircularProgress />}>
      <Component {...props} />
    </Suspense>
  )

  // Сохраняем имя компонента для отладки
  WrappedComponent.displayName = `withI18n(${Component.displayName || Component.name || 'Component'})`

  return WrappedComponent
}
