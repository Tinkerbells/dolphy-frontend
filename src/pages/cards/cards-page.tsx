// src/pages/cards/cards-page.tsx

import { observer } from 'mobx-react-lite'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, PlayCircle, Plus, Search, X } from 'lucide-react'
import { ActionIcon, Button, Container, Group, Modal, Stack, TextInput, Title } from '@mantine/core'

import type { CardDto } from '@/models/cards'
import type { CardStore } from '@/controllers/card-store'
import type { DeckStore } from '@/controllers/deck-store'

import { SYMBOLS } from '@/di/symbols'
import { Page } from '@/components/page'
import { withDependencies } from '@/di/inject'
import { CardListView } from '@/views/cards/card-list.view'
import { CardFormView } from '@/views/cards/card-form.view'

interface CardsPageProps {
  deckStore: DeckStore
  cardStore: CardStore
}

const CardsPageComponent = observer(({ deckStore, cardStore }: CardsPageProps) => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [currentCard, setCurrentCard] = useState<CardDto | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')
  const [tags, setTags] = useState<string[]>([])

  const [createModalOpened, { open: openCreateModal, close: closeCreateModal }] = useDisclosure(false)
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false)

  // Загружаем колоду и карточки при монтировании
  useEffect(() => {
    if (!deckId) {
      navigate('/decks')
      return
    }

    const loadDeckAndCards = async () => {
      const deck = await deckStore.loadDeck(deckId)
      if (!deck) {
        navigate('/decks')
        return
      }

      await cardStore.loadCards(deckId)
    }

    loadDeckAndCards()
  }, [deckId, navigate, deckStore, cardStore])

  // Фильтрация карточек по поисковому запросу
  const filteredCards = search.trim()
    ? cardStore.cards.cards.filter(card =>
        card.front.toLowerCase().includes(search.toLowerCase())
        || card.back.toLowerCase().includes(search.toLowerCase())
        || card.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())),
      )
    : cardStore.cards.cards

  // Получение всех уникальных тегов из колоды
  const allTags = Array.from(new Set(
    cardStore.cards.cards.flatMap(card => card.tags),
  )).sort()

  // Обработчики форм
  const handleOpenCreateForm = () => {
    setIsEditMode(false)
    setFront('')
    setBack('')
    setTags([])
    setCurrentCard(null)
    openCreateModal()
  }

  const handleOpenEditForm = (cardId: string) => {
    const card = cardStore.cards.cards.find(c => c.id === cardId)
    if (!card)
      return

    setIsEditMode(true)
    setFront(card.front)
    setBack(card.back)
    setTags([...card.tags])
    setCurrentCard(card)
    openCreateModal()
  }

  const handleOpenDeleteConfirm = (cardId: string) => {
    const card = cardStore.cards.cards.find(c => c.id === cardId)
    if (!card)
      return

    setCurrentCard(card)
    openDeleteModal()
  }

  const handleCreateOrUpdateCard = async () => {
    if (isEditMode && currentCard) {
      await cardStore.updateCard(currentCard.id, {
        front,
        back,
        tags,
      })
    }
    else if (deckId) {
      await cardStore.createCard(deckId, front, back, tags)
    }

    closeCreateModal()
  }

  const handleDeleteCard = async () => {
    if (currentCard) {
      await cardStore.deleteCard(currentCard.id)
      closeDeleteModal()
    }
  }

  return (
    <Page>
      <Container p="md">
        <Stack gap="lg">
          <Group justify="space-between">
            <Group>
              <ActionIcon variant="light" onClick={() => navigate(`/deck/${deckId}`)}>
                <ArrowLeft size={18} />
              </ActionIcon>
              <Title order={2}>
                {deckStore.currentDeck?.title || 'Cards'}
              </Title>
            </Group>
            <Group>
              <Button
                leftSection={<PlayCircle size={18} />}
                onClick={() => navigate(`/study/${deckId}`)}
                disabled={filteredCards.length === 0}
              >
                Study
              </Button>
              <Button
                leftSection={<Plus size={18} />}
                onClick={handleOpenCreateForm}
              >
                Add Card
              </Button>
            </Group>
          </Group>

          <TextInput
            placeholder="Search cards..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            rightSection={
              search
                ? (
                    <ActionIcon onClick={() => setSearch('')}>
                      <X size={16} />
                    </ActionIcon>
                  )
                : (
                    <Search size={16} />
                  )
            }
          />

          <CardListView
            cards={filteredCards}
            loading={cardStore.isLoading || deckStore.isLoading}
            onCardClick={cardId => handleOpenEditForm(cardId)}
            onEditClick={cardId => handleOpenEditForm(cardId)}
            onDeleteClick={cardId => handleOpenDeleteConfirm(cardId)}
          />
        </Stack>

        {/* Модальное окно создания/редактирования карточки */}
        <Modal
          opened={createModalOpened}
          onClose={closeCreateModal}
          title={isEditMode ? 'Edit Card' : 'Create New Card'}
        >
          <CardFormView
            front={front}
            back={back}
            tags={tags}
            availableTags={allTags}
            loading={cardStore.isLoading}
            onFrontChange={setFront}
            onBackChange={setBack}
            onTagsChange={setTags}
            onSubmit={handleCreateOrUpdateCard}
            onCancel={closeCreateModal}
            isEdit={isEditMode}
          />
        </Modal>

        {/* Модальное окно подтверждения удаления */}
        <Modal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          title="Confirm Deletion"
        >
          <Stack>
            <div>
              Are you sure you want to delete this card?
              <p>
                <strong>Front:</strong>
                {' '}
                {currentCard?.front}
              </p>
            </div>
            <Group justify="flex-end">
              <Button variant="outline" onClick={closeDeleteModal}>
                Cancel
              </Button>
              <Button color="red" onClick={handleDeleteCard}>
                Delete
              </Button>
            </Group>
          </Stack>
        </Modal>
      </Container>
    </Page>
  )
})

export const CardsPage = withDependencies(
  CardsPageComponent,
  {
    deckStore: SYMBOLS.DeckStore,
    cardStore: SYMBOLS.CardStore,
  },
)
