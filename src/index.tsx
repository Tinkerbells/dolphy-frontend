import React from 'react'
import ReactDOM from 'react-dom/client'
import { Inversiland } from 'inversiland'

import AppModule from './app-module'
import { App } from './core/presentation/app'

Inversiland.options.defaultScope = 'Singleton'
Inversiland.options.logLevel = 'debug'
Inversiland.run(AppModule)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
