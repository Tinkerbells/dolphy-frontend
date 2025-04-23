import { Container } from '@wox-team/wox-inject'

export const rootContainer = new Container()

export function createChildContainer(shouldInheritScopes = true): Container {
  return new Container(rootContainer, shouldInheritScopes)
}
