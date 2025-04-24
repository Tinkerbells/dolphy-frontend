import 'reflect-metadata'
import { Container } from 'inversify'

import { authModule, notificationModule, queryClientModule } from './modules'

const container = new Container({
  autobind: true,
  defaultScope: 'Singleton',
})

container.load(
  authModule,
  notificationModule,
  queryClientModule,
)

export { container }
