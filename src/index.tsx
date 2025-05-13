import React from 'react'
import i18next from 'i18next'
import ReactDOM from 'react-dom/client'
import { Inversiland } from 'inversiland'

import AppModule from './app-module'
import { App } from './core/presentation/app'
import { I18nAdapter } from './core/infrastructure/adapters/i18n'

Inversiland.options.defaultScope = 'Singleton'
Inversiland.options.logLevel = 'debug'
Inversiland.run(AppModule)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
