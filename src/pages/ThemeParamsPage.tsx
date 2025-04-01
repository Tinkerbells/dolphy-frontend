import type { FC } from 'react'

import { List } from '@telegram-apps/telegram-ui'
import { themeParams, useSignal } from '@telegram-apps/sdk-react'

import { Page } from '@/components/page'
import { DisplayData } from '@/components/DisplayData/DisplayData.tsx'

export const ThemeParamsPage: FC = () => {
  const tp = useSignal(themeParams.state)

  return (
    <Page>
      <List>
        <DisplayData
          rows={
            Object
              .entries(tp)
              .map(([title, value]) => ({
                title: title
                  .replace(/[A-Z]/g, m => `_${m.toLowerCase()}`)
                  .replace(/background/, 'bg'),
                value,
              }))
          }
        />
      </List>
    </Page>
  )
}
