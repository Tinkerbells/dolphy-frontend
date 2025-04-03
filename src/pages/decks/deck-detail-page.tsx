// src/pages/decks/deck-detail-page.tsx

import { ArrowLeft } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActionIcon, Button, Container, Group, Modal, Stack, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'

import { SYMBOLS } from '@/di/symbols'
import { Page } from '@/components/page'
import { withDependencies } from '@/di/inject'
import { DeckFormView } from '@/views/decks/deck-form.view'
import { DeckDetailView } from '@/views/decks/deck-detail.view'

interface DeckDetailPageProps {
  deckStore: DeckStore
}

const DeckDetailPageComponent = observer(({ deckStore }: DeckDetailPageProps) => {
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
      const deck = await deckStore.loadDeck(deckId)
      if (!deck) {
        navigate('/decks')
        return
      }

      // Инициализация формы редактирования
      setTitle(deck.title)
      setDescription(deck.description)
    }

    loadDeck()
  }, [deckId, navigate, deckStore])

  const handleOpenEditForm = () => {
    if (deckStore.currentDeck) {
      setTitle(deckStore.currentDeck.title)
      setDescription(deckStore.currentDeck.description)
    }
    openEditModal()
  }

  const handleUpdateDeck = async () => {
    if (deckId) {
      await deckStore.updateDeck(deckId, {
        title,
        description,
      })
      closeEditModal()
    }
  }

  const handleDeleteDeck = async () => {
    if (deckId) {
      const success = await deckStore.deleteDeck(deckId)
      if (success) {
        navigate('/decks')
      }
    }
  }

  if (!deckStore.currentDeck) {
    return null
  }

  return (
    <Page>
      <Container p="md">
        <Stack gap="lg">
          <Group>
            <ActionIcon variant="light" onClick={() => navigate('/decks')}>
              <ArrowLeft size={18} />
            </ActionIcon>
            <Title order={2}>Deck Details</Title>
          </Group>

          <DeckDetailView
            deck={deckStore.currentDeck}
            loading={deckStore.isLoading}
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
            loading={deckStore.isLoading}
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
              {deckStore.currentDeck.title}
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

export const DeckDetailPage = withDependencies(
  DeckDetailPageComponent,
  {
    deckStore: SYMBOLS.DeckStore,
  },
)
