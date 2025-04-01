import { observer } from 'mobx-react-lite'
import { useDisclosure } from '@mantine/hooks'
// src/ui/DeckDetail/DeckDetailPage.tsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Menu,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'

import type { Card as FlashCard } from '../../domain/card'

import { formatDate } from '../../lib/datetime'
import { useTelegram } from '../../services/telegram-adapter'
// Import use case for creating cards
import { useCreateCard } from '../../application/create-card'
import { useNotifier } from '../../services/notification-adapter'
import { useCardsStorage, useDecksStorage } from '../../services/storage-adapter'

// Card component to display a flashcard
const CardItem: React.FC<{ card: FlashCard }> = observer(({ card }) => {
  const navigate = useNavigate()

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder onClick={() => navigate(`/card/edit/${card.id}`)}>
      <Stack gap="sm">
        <Text fw={500} lineClamp={2}>{card.front}</Text>
        <Divider />
        <Text size="sm" c="dimmed" lineClamp={2}>{card.back}</Text>

        <Group gap="xs" mt="auto">
          {card.tags.map((tag, index) => (
            <Badge key={index} size="sm">{tag}</Badge>
          ))}

          <Text size="xs" c="dimmed" ml="auto">
            {card.lastReviewed
              ? `Last reviewed: ${formatDate(card.lastReviewed)}`
              : `Created: ${formatDate(card.created)}`}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
})

// Delete deck confirmation modal
const DeleteDeckModal: React.FC<{
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  deckTitle: string
}> = ({ opened, onClose, onConfirm, deckTitle }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Delete Deck">
      <Stack>
        <Text>
          Are you sure you want to delete the deck "
          {deckTitle}
          "? This will delete all cards in this deck and cannot be undone.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button color="red" onClick={onConfirm}>Delete</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

// Import cards modal
const ImportCardsModal: React.FC<{
  opened: boolean
  onClose: () => void
  deckId: string
}> = ({ opened, onClose, deckId }) => {
  const [importText, setImportText] = useState('')
  const { createBulkCards } = useCreateCard() // Import this from application layer
  const notifier = useNotifier()

  const handleImport = async () => {
    if (!importText.trim()) {
      notifier.notify('Import text is empty')
      return
    }

    try {
      // Parse the import format: front; back; [optional tags]
      const lines = importText.split('\n').filter(line => line.trim())
      const cardsToImport = lines.map((line) => {
        const parts = line.split(';').map(part => part.trim())
        if (parts.length < 2)
          return null

        const [front, back] = parts
        const tags = parts[2] ? parts[2].split(',').map(tag => tag.trim()) : []

        return { front, back, tags }
      }).filter(Boolean) as Array<{ front: string, back: string, tags: string[] }>

      if (cardsToImport.length === 0) {
        notifier.notify('No valid cards found to import')
        return
      }

      await createBulkCards(cardsToImport, deckId)
      onClose()
    }
    catch (error) {
      notifier.notify('Error importing cards')
      console.error('Import error:', error)
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Import Cards" size="lg">
      <Stack>
        <Text size="sm">
          Import cards in the format: front; back; tag1,tag2,tag3
          <br />
          Each line will be treated as a separate card.
        </Text>

        <textarea
          value={importText}
          onChange={e => setImportText(e.target.value)}
          placeholder="Question; Answer; tag1,tag2"
          rows={10}
          style={{ width: '100%', padding: '8px' }}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleImport}>Import Cards</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

// Main deck detail page
export const DeckDetailPage: React.FC = observer(() => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const telegram = useTelegram()
  const { getDeck, deleteDeck } = useDecksStorage()
  const { getCardsByDeck } = useCardsStorage()
  const [search, setSearch] = useState('')
  const [deleteModalOpened, deleteModal] = useDisclosure(false)
  const [importModalOpened, importModal] = useDisclosure(false)

  const deck = deckId ? getDeck(deckId) : undefined
  const cards = deckId ? getCardsByDeck(deckId) : []

  // Set page title and back button
  useEffect(() => {
    telegram.showBackButton(true)
    const cleanup = telegram.onBackButtonClick(() => {
      navigate('/')
    })

    return cleanup
  }, [deck, navigate, telegram])

  // If deck not found, redirect to home
  useEffect(() => {
    if (deckId && !deck) {
      navigate('/')
    }
  }, [deck, deckId, navigate])

  if (!deck)
    return null

  // Filter cards by search
  const filteredCards = cards.filter(card =>
    card.front.toLowerCase().includes(search.toLowerCase())
    || card.back.toLowerCase().includes(search.toLowerCase())
    || card.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase())),
  )

  // Handle deck deletion
  const handleDeleteDeck = () => {
    if (deckId) {
      deleteDeck(deckId)
      navigate('/')
    }
  }

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Stack gap={0}>
            <Title order={2}>{deck.title}</Title>
            {deck.description && (
              <Text c="dimmed">{deck.description}</Text>
            )}
          </Stack>

          <Menu position="bottom-end" shadow="md">
            <Menu.Target>
              <ActionIcon>
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item>
                Edit Deck
              </Menu.Item>
              <Menu.Item
                onClick={importModal.open}
              >
                Import Cards
              </Menu.Item>
              <Menu.Item
                color="red"
                onClick={deleteModal.open}
              >
                Delete Deck
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Group>
          <Badge color="blue">
            {cards.length}
            {' '}
            cards
          </Badge>
          {deck.newCount > 0 && (
            <Badge color="green">
              {deck.newCount}
              {' '}
              new
            </Badge>
          )}
          {deck.reviewCount > 0 && (
            <Badge color="yellow">
              {deck.reviewCount}
              {' '}
              to review
            </Badge>
          )}
        </Group>

        <Group>
          <Button
            onClick={() => navigate(`/study/${deckId}`)}
            disabled={cards.length === 0}
          >
            Study Now
          </Button>

          <Button
            variant="light"
            onClick={() => navigate(`/card/new/${deckId}`)}
          >
            Add Card
          </Button>
        </Group>

        <TextInput
          placeholder="Search cards..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          rightSection={
            search
              ? (
                  <ActionIcon onClick={() => setSearch('')}>
                  </ActionIcon>
                )
              : null
          }
        />

        {filteredCards.length === 0
          ? (
              <Stack align="center" gap="md" my="xl">
                <Text c="dimmed">
                  {cards.length === 0
                    ? 'This deck has no cards yet'
                    : 'No cards match your search'}
                </Text>
                <Button
                  onClick={() => navigate(`/card/new/${deckId}`)}
                >
                  Add a Card
                </Button>
              </Stack>
            )
          : (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {filteredCards.map(card => (
                  <CardItem key={card.id} card={card} />
                ))}
              </SimpleGrid>
            )}
      </Stack>

      <DeleteDeckModal
        opened={deleteModalOpened}
        onClose={deleteModal.close}
        onConfirm={handleDeleteDeck}
        deckTitle={deck.title}
      />

      <ImportCardsModal
        opened={importModalOpened}
        onClose={importModal.close}
        deckId={deckId || ''}
      />
    </Container>
  )
})
