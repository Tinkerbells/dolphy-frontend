import type { CustomRequest, NetRequest, NetService } from './types'

import { mockRequest } from './net-request'

class NetMock implements NetService {
  private _isAuthorized: boolean = true

  protected _send<T>(request: CustomRequest): NetRequest<T> {
    throw new Error('Method not implemented.')
  }

  protected _sendRequest<T>(request: CustomRequest): Promise<T> {
    throw new Error('Method not implemented.')
  }

  abortRequests(keys: string[]) {}

  goToAuth() {}

  isAuthorized(): boolean {
    return this._isAuthorized
  }

  logIn(code: string): NetRequest<void> {
    return mockRequest(200)
  }

  logOut() {
    this._isAuthorized = false
  }
}

export { NetMock }

