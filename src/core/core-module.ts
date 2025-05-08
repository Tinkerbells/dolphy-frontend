import { module } from 'inversiland'

import { EnvPortToken } from './domain/ports/env.port'
import { Notify } from './infrastructure/adapters/notify'
import { NotifyPortToken } from './domain/ports/notify.port'
import { HttpClient } from './infrastructure/adapters/http-client'
import { HttpClientPortToken } from './domain/ports/http-client.port'
import { PersistStoragePortToken } from './domain/ports/persist-storage.port'
import { LocalStorageAdapter } from './infrastructure/adapters/local-storage'
import { ViteEnvironmentAdapter } from './infrastructure/adapters/env'

@module({
  providers: [
    {
      isGlobal: true,
      provide: EnvPortToken,
      useClass: ViteEnvironmentAdapter,
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
    {
      isGlobal: true,
      provide: PersistStoragePortToken,
      useClass: LocalStorageAdapter,
    },
  ],
})

export class CoreModule {}
