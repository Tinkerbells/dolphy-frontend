import 'reflect-metadata'
import { Container } from 'inversify'

import { authModule } from './modules/auth.module'

const container = new Container({
  autobind: true,
  defaultScope: 'Singleton',
})

container.load(
  authModule,
)

export { container }
