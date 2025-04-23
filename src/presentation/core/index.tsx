import 'reflect-metadata'
import ReactDOM from 'react-dom/client'
import React, { StrictMode } from 'react'

import App from './app'
import { env } from '../../lib/env'
import { setupMobxDevTools } from '../../devtools'
import { mobxQueryClient } from '../../lib/mobx-query'

const root = ReactDOM.createRoot(document.getElementById('root')!)

if (env.NODE_ENV === 'development') {
  setupMobxDevTools()
}

mobxQueryClient.mount()

root.render(
  <StrictMode>
    <App />
  </StrictMode>,
)
