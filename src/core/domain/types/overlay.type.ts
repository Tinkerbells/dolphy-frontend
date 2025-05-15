export interface QueueItem {
  key: string
}

export interface OverlayState<T extends QueueItem> {
  scheme: T
  isOpened: boolean
  details?: any
}

export interface OverlayQueue<T extends QueueItem> {
  show: (value: T) => void
  hide: (key: string) => void
  hideAll: () => void
}
