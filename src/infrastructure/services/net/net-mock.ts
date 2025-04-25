import type { CustomRequest, NetService } from './types'

class NetMock implements NetService {
  private _isAuthorized: boolean = true

  // eslint-disable-next-line unused-imports/no-unused-vars
  protected async _sendRequest<T>(request: CustomRequest): Promise<T> {
    throw new Error('Method not implemented.')
  }

  goToAuth() {}

  isAuthorized(): boolean {
    return this._isAuthorized
  }
}

export { NetMock }
