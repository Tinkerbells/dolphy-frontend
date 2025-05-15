export const ModalPortToken = Symbol('ModalPort')

export interface ModalPort {
  show: (options: any) => void
  hide: (key: string) => void
  hideAll: () => void
}
