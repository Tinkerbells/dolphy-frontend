import type { Milliseconds } from '@/types/primitive.types'

import type { CustomRequest, NetRequest } from './types'

import { returnDataAfterDelay } from './timeout-promise'

export interface RequestNote<T> {
  promise: Promise<T>
  onFinish?: () => void
  request: CustomRequest
  controller: AbortController
}

class NetRequestHandler<T> implements NetRequest<T> {
  isClosed: boolean
  abort: () => void

  private _promise: Promise<any>
  private _controller: AbortController

  constructor(options: RequestNote<unknown>) {
    this._controller = options.controller
    this.isClosed = this._controller.signal.aborted || false
    this._promise = options.promise.finally(() => {
      this.isClosed = true
      options.onFinish && options.onFinish()
    })
    this.abort = () => {
      this._controller.abort()
    }

    this.updatePromise = this.updatePromise.bind(this)
  }

  get promise(): Promise<T> {
    return this._promise
  }

  get controller(): AbortController {
    return this._controller
  }

  updatePromise<K>(promise: Promise<K>): NetRequest<K> {
    if (!(promise instanceof Promise)) {
      return this as unknown as NetRequest<K>
    }
    this._promise = promise
    return this as unknown as NetRequest<K>
  }

  quiet(): NetRequest<T> {
    this._promise = this._promise.catch((error: Error) => {
      console.error(error)
    })
    return this
  }
}

export function mockRequest<T>(delay: Milliseconds, response?: T): NetRequest<T> {
  const controller = new AbortController()
  return new NetRequestHandler({
    promise: returnDataAfterDelay({ delay, controller, data: response }),
    request: {
      path: '',
    },
    controller,
  })
}

export { NetRequestHandler }

