export interface Modal {
  show: (options: any) => void
  hide: (key: string) => void
  hideAll: () => void
}
