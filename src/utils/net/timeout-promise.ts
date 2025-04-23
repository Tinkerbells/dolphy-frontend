import { NetError } from './net-error'

export function pause(delay: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay)
  })
}

interface DelayedData {
  delay: number
  controller: AbortController
  data?: any
}

export function returnDataAfterDelay({
  delay,
  controller,
  data,
}: DelayedData) {
  return new Promise((resolve) => {
    let timer: ReturnType<typeof setTimeout> | null = null
    const onAbort = () => {
      if (timer) {
        clearTimeout(timer)
        throw new NetError({
          code: 1,
          status: 'abort',
        })
      }
    }
    controller.signal.addEventListener('abort', onAbort)
    timer = setTimeout(() => {
      controller.signal.removeEventListener('abort', onAbort)
      timer = null
      resolve(data)
    }, delay)
  })
}
