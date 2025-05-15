import type { ModalPort } from '@/core/domain/ports/modal.port'

import { ModalPortToken } from '@/core/domain/ports/modal.port'

import { DialogWindow } from './modal'
import { useInjected } from '../../react'

/**
 * Тип параметров диалогового окна
 */
export interface DialogType {
  key: string
  header: string
  primaryLabel: string
  primaryAction: () => void
  secondaryLabel?: string
  secondaryAction?: () => void
  children?: React.ReactNode
}

/**
 * Открывает диалоговое окно подтверждения
 *
 * @param options Параметры диалогового окна
 */
export function openDialogWindow(options: DialogType): void {
  const modalDialogPort = useInjected<ModalPort>(ModalPortToken)

  modalDialogPort.show({
    key: options.key,
    element: DialogWindow,
    props: options,
  })
}

/**
 * Создаёт обработчик закрытия диалогового окна
 *
 * @param key Ключ диалогового окна
 * @returns Обработчик закрытия
 */
export function closeDialogWindowHandler(key: string): () => void {
  const modalDialogPort = useInjected<ModalPort>(ModalPortToken)

  return () => {
    modalDialogPort.hide(key)
  }
}
