import 'reflect-metadata'
import ReactDOM from 'react-dom/client'
import React, { StrictMode } from 'react'

import App from './app'
import { env } from '../../utils/env'
import { setupMobxDevTools } from '../../devtools'
import { queryClient } from '../../utils/query-client'

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (env.isDevelopment()) {
  setupMobxDevTools()
}

queryClient.mount()

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
