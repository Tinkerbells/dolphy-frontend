import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { closeDialogWindow, openDialogWindow, openModalWindow } from '@/common'

import type { DeckDetailController } from '../../controllers'

export function useCardsModals(controller: DeckDetailController) {
  const { t } = useTranslation(['common', 'cards'])

  useEffect(() => {
    if (!controller) {
      return
    }

    controller.setModalsHandlers({
      create: () => openModalWindow({
        key: 'create-card',
        element: () => null,
        props: {
          // onCancel: closeModalWindowHandler('create-card'),
          // createCardForm: controller.createCardForm,
        },
        title: t('cards:createCard'),
      }),
      delete: (_cardId: string) => openDialogWindow({
        key: 'delete-card',
        title: t('cards:deleteCard'),
        description: t('cards:confirmDelete'),
        props: {
          onConfirmLabel: t('cards:delete'),
          onCancelLabel: t('common:actions.cancel'),
          onCancel: closeDialogWindow('delete-card'),
          // onConfirm: () => controller.deleteCard(cardId),
        },
      }),
    })
  }, [controller, t])
}
