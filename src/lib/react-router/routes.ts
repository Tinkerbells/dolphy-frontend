import { route } from 'react-router-typesafe-routes'

import { env } from '../env'

export const root = route({
  path: env.BASE_URL.replace('/', ''),
  children: {
    decks: route({
      path: 'decks',
      children: {
        detail: route({
          path: 'detail',
        }),
      },
    }),
  },
})
