import { module } from 'inversiland'

import { CoreModule } from './core/core-module'
import { AuthModule } from './auth/auth-module'

@module({
  imports: [CoreModule, AuthModule],
})

export default class AppModule {}
