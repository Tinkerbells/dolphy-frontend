// Include Telegram UI styles first to allow our code override the package CSS.
import '@telegram-apps/telegram-ui/dist/styles.css'
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { retrieveLaunchParams } from '@telegram-apps/sdk-react'

import { init } from '@/init.ts'
import { Root } from '@/components/root.tsx'
import { EnvUnsupported } from '@/components/env-unsupported.tsx'

import './index.css'
// Mock the environment in case, we are outside Telegram.
import './mockEnv.ts'

const root = ReactDOM.createRoot(document.getElementById('root')!)

try {
  const launchParams = retrieveLaunchParams()
  const { tgWebAppPlatform: platform } = launchParams
  const debug = (launchParams.tgWebAppStartParam || '').includes('platformer_debug')
    || import.meta.env.DEV

  await init({
    debug,
    eruda: debug && ['ios', 'android'].includes(platform),
    mockForMacOS: platform === 'macos',
  })
    .then(() => {
      root.render(
        <StrictMode>
          <Root />
        </StrictMode>,
      )
    })
}
catch (e) {
  root.render(<EnvUnsupported />)
}
