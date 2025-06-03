import 'reflect-metadata'
import { vi } from 'vitest'
import { enableStaticRendering } from 'mobx-react-lite'
import { act, fireEvent, render, screen } from '@testing-library/react'

import { modalInstance } from '@/common/services/overlays/modal'

import { ModalHandler } from './modal-handler'

enableStaticRendering(false)

function TestModal({ onClose }: { onClose: () => void }) {
  return (
    <div>
      <p>Содержимое модального окна</p>
      <button data-testid="close-button" onClick={onClose}>Закрыть</button>
    </div>
  )
}

describe('modalHandler', () => {
  beforeEach(() => {
    render(<ModalHandler />)
    act(() => {
      modalInstance.show({
        key: 'test',
        element: TestModal,
        props: { onClose: () => modalInstance.hide('test') },
        title: 'Тестовый заголовок',
        description: 'Тестовое описание',
      })
    })
  })

  it('отображает TestModal напрямую', () => {
    expect(screen.getByText('Закрыть')).toBeInTheDocument()
  })

  it('закрывает модальное окно при клике на кнопку закрытия', () => {
    const closeButton = screen.getByTestId('close-button')
    fireEvent.click(closeButton)

    act(() => {
      vi.useFakeTimers()
    })

    expect(modalInstance.queue.front?.isOpened).toBe(false)
  })
})
