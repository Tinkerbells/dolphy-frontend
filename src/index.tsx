import React from 'react'
import ReactDOM from 'react-dom/client'

import { App } from './app'
import { i18nInstance } from './common'

// Инициализация i18n перед рендерингом React-приложения
i18nInstance.init().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
})
