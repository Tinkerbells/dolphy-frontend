// Required by Inversify at the entry point of the application
import 'reflect-metadata'
// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css'
import ReactDOM from 'react-dom/client'
import React, { StrictMode } from 'react'
import '@mantine/core/styles.css'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'

import App from './app'
import { init } from './init'
// Mock the environment in case, we are outside Telegram.
import './mockEnv'
// Импортируем настройку MobX DevTools
import { setupMobxDevTools } from './devtools'
import { EnvUnsupported } from './components/env-unsupported'

const root = ReactDOM.createRoot(document.getElementById('root')!)

try {
  const launchParams = retrieveLaunchParams()
  const { tgWebAppPlatform: platform } = launchParams
  const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug')
    || import.meta.env.DEV

  await init({
    // Configure all application dependencies.
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  })
    .then(() => {
      // Вызываем настройку MobX DevTools после инициализации приложения
      setupMobxDevTools()

      root.render(
        <StrictMode>
          <App />
        </StrictMode>,
      )
    })
}
catch (e) {
  root.render(<EnvUnsupported />)
}
