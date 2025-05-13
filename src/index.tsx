import React from 'react'
import ReactDOM from 'react-dom/client'
import { getModuleContainer, Inversiland } from 'inversiland'

import type { I18nAdapter } from './core/infrastructure/adapters/i18n'

import AppModule from './app-module'
import { App } from './core/presentation/app'
import { I18nPortToken } from './core/domain/ports/i18n.port'

Inversiland.options.defaultScope = 'Singleton'
Inversiland.options.logLevel = 'debug'
Inversiland.run(AppModule)

const coreModuleContainer = getModuleContainer(AppModule)
const i18nAdapter = coreModuleContainer.get<I18nAdapter>(I18nPortToken)

// Инициализация i18n перед рендерингом React-приложения
i18nAdapter.init().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
