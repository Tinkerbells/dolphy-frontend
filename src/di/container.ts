import 'reflect-metadata'
import { Container } from 'inversify'

import {
  authModule,
  decksModule,
  notificationModule,
  persistModule,
  profileModule,
  queryClientModule,
} from './modules'

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
  decksModule,
)

export { container }
