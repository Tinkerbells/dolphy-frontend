import type { NavigateHandler, RouterService } from '../router.service'

/**
 * реализация RouterService, предназначенная в основном для использования в тестах
 */
export class MockingRouterService implements RouterService {
  constructor(initPath: string) {
    this.pathname = initPath
  }

  public pathname = '/'

  public navigate: NavigateHandler = (path) => {
    this.pathname = path
  }
}
