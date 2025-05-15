import { module } from 'inversiland'

import { CoreModule } from './core/core-module'
import { AuthModule } from './auth/auth-module'
import { DecksModule } from './decks/decks-module'

@module({
  imports: [CoreModule, AuthModule, DecksModule],
})

export default class AppModule {}
