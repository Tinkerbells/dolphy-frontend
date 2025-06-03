import { makeAutoObservable } from 'mobx'

import type { NavigateHandler, RouterService } from '../router.service'

/**
 * параметры для инициализации
 */
interface RouterParams {
  navigate: NavigateHandler
}

/**
 * реализация RouterService, предназначенная для того,
 * чтобы адаптировать реакт роутер к апи версии,
 * и иметь возможность использовать роутер в доменной логике
 */
export class AdaptableRouterService implements RouterService {
  private navigateHandler?: NavigateHandler

  private currentPathname: string

  constructor() {
    this.currentPathname = globalThis.location?.pathname ?? ''
    makeAutoObservable(this)
  }

  public navigate: NavigateHandler = (path, params) => {
    this.navigateHandler?.(path, params)
  }

  public init = (params: RouterParams) => {
    this.navigateHandler = params.navigate
  }

  public get pathname() {
    return this.currentPathname
  }

  /**
   * метод для установки текущего адреса
   */
  public updatePathname = (pathname: string) => {
    this.currentPathname = pathname
  }
}

export const router = new AdaptableRouterService()
