import * as React from 'react'

export const SettingsPage = React.lazy(() => import('./settings-page.tsx').then(module => ({
  default: module.SettingsPage,
})))
