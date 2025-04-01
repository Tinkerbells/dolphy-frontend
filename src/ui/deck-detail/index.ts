import * as React from 'react'

export const DeckDetailPage = React.lazy(() => import('./deck-detail-page.tsx').then(module => ({
  default: module.DeckDetailPage,
})))
