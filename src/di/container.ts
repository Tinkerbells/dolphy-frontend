import 'reflect-metadata'
import { Container } from 'inversify'

import { authModule, notificationModule, persistModule, profileModule, queryClientModule } from './modules'

const container = new Container({
  autobind: true,
  defaultScope: 'Singleton',
})

container.load(
  authModule,
  notificationModule,
  queryClientModule,
  persistModule,
  profileModule,
)

export { container }
