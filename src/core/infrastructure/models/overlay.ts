export interface QueueItem {
  key: string
}

export interface OverlayState<T extends QueueItem> {
  scheme: T
  isOpened: boolean
  details?: any
}

export interface OverlayQueue<T extends QueueItem> {
  front: OverlayState<T> | null
  length: number
  queue: OverlayState<T>[]
  show: (value: T) => void
  hide: (key: string) => void
  hideAll: () => void
}
