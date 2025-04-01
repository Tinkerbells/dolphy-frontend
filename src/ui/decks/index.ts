import * as React from 'react'

export const DecksPage = React.lazy(() => import('./decks-page.tsx').then(module => ({
  default: module.DecksPage,
})))
