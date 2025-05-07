import { module } from 'inversiland'

import { EnvPortToken } from './domain/ports/env.port'
import { Notify } from './infrastructure/adapters/notify'
import { NotifyPortToken } from './domain/ports/notify.port'
import { HttpClient } from './infrastructure/adapters/http-client'
import { HttpClientPortToken } from './domain/ports/http-client.port'
import { ViteEnvironmentVariables } from './infrastructure/models/vite-env'

@module({
  providers: [
    {
      isGlobal: true,
      provide: EnvPortToken,
      useValue: ViteEnvironmentVariables,
    },
    {
      isGlobal: true,
      provide: HttpClientPortToken,
      useClass: HttpClient,
    },
    {
      isGlobal: true,
      provide: NotifyPortToken,
      useClass: Notify,
    },
  ],
})

export class CoreModule {}
