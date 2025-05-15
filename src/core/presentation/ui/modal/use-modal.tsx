import { useMemo } from 'react'

import type { ModalOptions, ModalPort, ModalWindowBase } from '@/core/domain/ports/modal.port'

import { useInjected } from '@/core/presentation/react'
import { ModalPortToken } from '@/core/domain/ports/modal.port'

type ModalWindowHandlers = [
  open: () => void,
  close: () => void,
]

/**
 * Хук для создания обработчиков открытия/закрытия модального окна
 *
 * @param options Параметры модального окна
 * @param deps Зависимости для useMemo
 * @returns Кортеж [openHandler, closeHandler]
 */
export function useModalWindow<T extends ModalWindowBase>(
  options: ModalOptions<T>,
  deps: any[] = [],
): ModalWindowHandlers {
  const modalDialogPort = useInjected<ModalPort>(ModalPortToken)

  return useMemo<ModalWindowHandlers>(() => [
    () => {
      modalDialogPort.show(options)
    },
    () => {
      modalDialogPort.hide(options.key)
    },
  ], [...deps])
}

/**
 * Функция для открытия модального окна
 *
 * @param options Параметры модального окна
 * @returns Функция закрытия
 */
export function openModalWindow<T extends ModalWindowBase>(
  options: ModalOptions<T>,
): () => void {
  const modalDialogPort = useInjected<ModalPort>(ModalPortToken)
  modalDialogPort.show(options)

  return () => {
    modalDialogPort.hide(options.key)
  }
}

/**
 * Функция для создания обработчика закрытия модального окна
 *
 * @param key Ключ модального окна
 * @returns Обработчик закрытия
 */
export function closeModalWindowHandler(key: string): () => void {
  const modalDialogPort = useInjected<ModalPort>(ModalPortToken)

  return () => {
    modalDialogPort.hide(key)
  }
}
