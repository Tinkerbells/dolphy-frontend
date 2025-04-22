import { observer } from 'mobx-react-lite'
import { useEffect, useState } from 'react'
import { useDisclosure } from '@mantine/hooks'
import { useNavigate, useParams } from 'react-router'
import { Button, Container, Group, Modal, Stack, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'

import { SYMBOLS } from '@/di/symbols'
import { Page } from '@/components/page'
import { useService } from '@/di/provider'

import { DeckFormView } from '../ui/deck-form.view'
import { DeckDetailView } from '../ui/deck-detail.view'

export const DeckDetailPage = observer(() => {
  const store = useService<DeckStore>(SYMBOLS.DeckStore)
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false)
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false)

  useEffect(() => {
    if (!deckId) {
      navigate('/decks')
      return
    }

    const loadDeck = async () => {
      const deck = await store.loadDeck(deckId)
      if (!deck) {
        navigate('/decks')
        return
      }

      setTitle(deck.title)
      setDescription(deck.description)
    }

    loadDeck()
  }, [deckId, navigate, store])

  const handleOpenEditForm = () => {
    if (store.currentDeck) {
      setTitle(store.currentDeck.title)
      setDescription(store.currentDeck.description)
    }
    openEditModal()
  }

  const handleUpdateDeck = async () => {
    if (deckId) {
      await store.updateDeck(deckId, {
        title,
        description,
      })
      closeEditModal()
    }
  }

  const handleDeleteDeck = async () => {
    if (deckId) {
      const success = await store.deleteDeck(deckId)
      if (success) {
        navigate('/decks')
      }
    }
  }

  if (!store.currentDeck) {
    return null
  }

  return (
    <Page>
      <Container p="md">
        <Stack gap="lg">
          <Group>
            <Title order={2}>Deck Details</Title>
          </Group>

          <DeckDetailView
            deck={store.currentDeck}
            loading={store.isLoading}
            onEditClick={handleOpenEditForm}
            onDeleteClick={openDeleteModal}
            onStudyClick={() => navigate(`/study/${deckId}`)}
            onManageCardsClick={() => navigate(`/deck/${deckId}/cards`)}
          />
        </Stack>

        {/* Модальное окно редактирования колоды */}
        <Modal opened={editModalOpened} onClose={closeEditModal} title="Edit Deck">
          <DeckFormView
            title={title}
            description={description}
            loading={store.isLoading}
            onTitleChange={setTitle}
            onDescriptionChange={setDescription}
            onSubmit={handleUpdateDeck}
            onCancel={closeEditModal}
          />
        </Modal>

        {/* Модальное окно подтверждения удаления */}
        <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Confirm Deletion">
          <Stack>
            <div>
              Are you sure you want to delete the deck "
              {store.currentDeck.title}
              "?
              <p>This will also delete all cards in this deck. This action cannot be undone.</p>
            </div>
            <Group justify="flex-end">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteDeck}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </Page>
  )
})
