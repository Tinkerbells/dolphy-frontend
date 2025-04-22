import { route } from 'react-router-typesafe-routes'

export const root = route({
  path: '',
  children: {
    'sign-in': route({
      path: 'sign-in',
    }),
    'decks': route({
      path: 'decks',
      children: {
        detail: route({
          path: 'detail',
        }),
      },
    }),
  },
})
