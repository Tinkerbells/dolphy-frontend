import * as React from 'react'

export const StudyPage = React.lazy(() => import('./study-page.tsx').then(module => ({
  default: module.StudyPage,
})))
