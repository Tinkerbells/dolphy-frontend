import { module } from 'inversiland'

import { EnvPortToken } from './domain/ports/env.port'
import { I18nPortToken } from './domain/ports/i18n.port'
import { Notify } from './infrastructure/adapters/notify'
import { ModalPortToken } from './domain/ports/modal.port'
import { NotifyPortToken } from './domain/ports/notify.port'
import { I18nAdapter } from './infrastructure/adapters/i18n'
import { ModalAdapter } from './infrastructure/adapters/overlays'
import { HttpClient } from './infrastructure/adapters/http-client'
import { HttpClientPortToken } from './domain/ports/http-client.port'
import { ViteEnvironmentAdapter } from './infrastructure/adapters/env'
import { PersistStoragePortToken } from './domain/ports/persist-storage.port'
import { LocalStorageAdapter } from './infrastructure/adapters/local-storage'

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
    {
      isGlobal: true,
      provide: I18nPortToken,
      useClass: I18nAdapter,
    },
    {
      isGlobal: true,
      provide: ModalPortToken,
      useClass: ModalAdapter,
    },
  ],
})

export class CoreModule {}
