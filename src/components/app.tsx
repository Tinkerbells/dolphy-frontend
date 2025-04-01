import { useMemo } from 'react'
import { MantineProvider } from '@mantine/core'
import { AppRoot } from '@telegram-apps/telegram-ui'
import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import '@mantine/core/styles.css'
import { isMiniAppDark, retrieveLaunchParams, useSignal } from '@telegram-apps/sdk-react'

import { routes } from '@/navigation/routes.tsx'

export function App() {
  const lp = useMemo(() => retrieveLaunchParams(), [])
  const isDark = useSignal(isMiniAppDark)

  return (
    <MantineProvider defaultColorScheme={isDark ? 'dark' : 'light'}>
      <AppRoot
        appearance={isDark ? 'dark' : 'light'}
        platform={['macos', 'ios'].includes(lp.tgWebAppPlatform) ? 'ios' : 'base'}
      >
        <HashRouter>
          <Routes>
            {routes.map(route => <Route key={route.path} {...route} />)}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </HashRouter>
      </AppRoot>
    </MantineProvider>
  )
}
