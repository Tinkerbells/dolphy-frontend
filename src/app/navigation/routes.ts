import { route, string } from 'react-router-typesafe-routes'

export const root = route({
  path: '',
  children: {
    'sign-in': route({
      path: 'sign-in',
    }),
    'sign-up': route({
      path: 'sign-up',
    }),
    'decks': route({
      path: 'decks',
      children: {
        detail: route({
          path: ':id',
          params: { id: string() },
          state: {
            deckName: string(),
          },
          children: {
            study: route({
              path: 'study',
              state: {
                deckName: string(),
              },
            }),
          },
        }),
      },
    }),
  },
})
