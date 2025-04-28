import { ContainerModule } from 'inversify'

import { Profile } from '@/application/profile'
import { ProfileStore } from '@/presentation/profile'

import { Symbols } from '../symbols'

export const profileModule = new ContainerModule((options) => {
  options.bind(Symbols.Profile).to(Profile).inSingletonScope()
  options.bind(Symbols.ProfileStore).to(ProfileStore).inSingletonScope()
})
