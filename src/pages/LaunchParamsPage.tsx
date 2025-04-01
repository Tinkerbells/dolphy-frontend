import type { FC } from 'react'

import { useMemo } from 'react'
import { List } from '@telegram-apps/telegram-ui'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'

import { Page } from '@/components/page'
import { DisplayData } from '@/components/DisplayData/DisplayData.tsx'

export const LaunchParamsPage: FC = () => {
  const lp = useMemo(() => retrieveLaunchParams(), [])

  return (
    <Page>
      <List>
        <DisplayData
          rows={[
            { title: 'tgWebAppPlatform', value: lp.tgWebAppPlatform },
            { title: 'tgWebAppShowSettings', value: lp.tgWebAppShowSettings },
            { title: 'tgWebAppVersion', value: lp.tgWebAppVersion },
            { title: 'tgWebAppBotInline', value: lp.tgWebAppBotInline },
            { title: 'tgWebAppStartParam', value: lp.tgWebAppStartParam },
            { title: 'tgWebAppData', type: 'link', value: '/init-data' },
            { title: 'tgWebAppThemeParams', type: 'link', value: '/theme-params' },
          ]}
        />
      </List>
    </Page>
  )
}
