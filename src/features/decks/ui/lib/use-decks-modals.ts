import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { closeDialogWindow, closeModalWindowHandler, openDialogWindow, openModalWindow } from '@/common'

import type { Deck } from '../../models/deck.domain'
import type { DecksController } from '../../controllers'

import { CreateDeckForm, EditDeckForm } from '../ui'

export function useDecksModals(controller: DecksController) {
  const { t } = useTranslation(['common', 'decks'])

  useEffect(() => {
    if (!controller) {
      return
    }
    controller.setModalsHandlers({
      create: () => openModalWindow({
        key: 'create-deck',
        element: CreateDeckForm,
        props: {
          onCancel: closeModalWindowHandler('create-deck'),
          createDeckForm: controller.deckCreateForm,
        },
        title: t('decks:createDeck'),
      }),
      update: (deck: Deck) => openModalWindow({
        key: 'update-deck',
        element: EditDeckForm,
        props: {
          onCancel: closeModalWindowHandler('update-deck'),
          editDeckForm: controller.deckUpdateForm(deck),
        },
        title: t('decks:editDeck'),
      }),
      delete: (id: Deck['id']) => openDialogWindow({
        key: 'delete-deck',
        title: t('decks:deleteDeck'),
        description: t('decks:confirmDelete'),
        props: {
          onConfirmLabel: t('decks:delete'),
          onCancelLabel: t('common:actions.cancel'),
          onCancel: closeDialogWindow('delete-deck'),
          onConfirm: () => controller.deleteDeck(id),
        },
      }),
    })
  }, [controller, t])
}
