import { observer } from 'mobx-react-lite'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Container,
  Divider,
  Group,
  Modal,
  MultiSelect,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'

import type { CardFace } from '../../domain/card'

import { useDICardsStorage, useDICreateCard, useDIDecksStorage, useDINotifier, useDITelegram } from '../../di/hooks'

// Delete card confirmation modal
const DeleteCardModal: React.FC<{
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}> = ({ opened, onClose, onConfirm }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Delete Card">
      <Stack>
        <Text>
          Are you sure you want to delete this card? This action cannot be undone.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button color="red" onClick={onConfirm}>Delete</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

// Card preview component
const CardPreview: React.FC<{
  front: string
  back: string
}> = ({ front, back }) => {
  const [showAnswer, setShowAnswer] = useState(false)

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack>
        <Title order={5}>Card Preview</Title>

        <Box mb="md">
          {showAnswer
            ? (
                <>
                  <Text fw={500} mb="xs">Question:</Text>
                  <Text>{front || 'Front side of the card'}</Text>

                  <Divider my="md" />

                  <Text fw={500} mb="xs">Answer:</Text>
                  <Text>{back || 'Back side of the card'}</Text>
                </>
              )
            : (
                <>
                  <Text fw={500} mb="xs">Question:</Text>
                  <Text>{front || 'Front side of the card'}</Text>
                </>
              )}
        </Box>

        <Button
          variant="light"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {showAnswer ? 'Hide Answer' : 'Show Answer'}
        </Button>
      </Stack>
    </Card>
  )
}

// Main card edit component
export const CardEditPage: React.FC<{
  mode: 'create' | 'edit'
}> = observer(({ mode }) => {
  const navigate = useNavigate()
  const telegram = useDITelegram()
  const notifier = useDINotifier()
  const { cardId } = useParams<{ cardId?: string }>()
  const { deckId } = useParams<{ deckId?: string }>()

  const cardStorage = useDICardsStorage()
  const deckStorage = useDIDecksStorage()
  const { createNewCard } = useDICreateCard()

  const [front, setFront] = useState<CardFace>('')
  const [back, setBack] = useState<CardFace>('')
  const [tags, setTags] = useState<string[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])

  const [deleteModalOpened, deleteModal] = useDisclosure(false)

  // Get all available tags from the deck
  useEffect(() => {
    if (mode === 'create' && deckId) {
      const deckCards = cardStorage.getCardsByDeck(deckId)
      const tagSet = new Set<string>()
      deckCards.forEach((card) => {
        card.tags.forEach(tag => tagSet.add(tag))
      })
      setAvailableTags(Array.from(tagSet))
    }
    else if (mode === 'edit' && cardId) {
      const card = cardStorage.getCard(cardId)
      if (card) {
        const deckCards = cardStorage.getCardsByDeck(card.deckId)
        const tagSet = new Set<string>()
        deckCards.forEach((c) => {
          c.tags.forEach(tag => tagSet.add(tag))
        })
        setAvailableTags(Array.from(tagSet))
      }
    }
  }, [mode, deckId, cardId, cardStorage])

  // Load card data for edit mode
  useEffect(() => {
    if (mode === 'edit' && cardId) {
      const card = cardStorage.getCard(cardId)
      if (card) {
        setFront(card.front)
        setBack(card.back)
        setTags(card.tags)
      }
      else {
        notifier.notify('Card not found')
        navigate('/')
      }
    }
  }, [mode, cardId, cardStorage, navigate, notifier])

  // Set page title and back button
  useEffect(() => {
    telegram.showBackButton(true)

    const cleanup = telegram.onBackButtonClick(() => {
      if (mode === 'create' && deckId) {
        navigate(`/deck/${deckId}`)
      }
      else if (mode === 'edit' && cardId) {
        const card = cardStorage.getCard(cardId)
        if (card) {
          navigate(`/deck/${card.deckId}`)
        }
        else {
          navigate('/')
        }
      }
      else {
        navigate('/')
      }
    })

    return cleanup
  }, [mode, deckId, cardId, telegram, navigate, cardStorage])

  // Get the current deck
  const deck = mode === 'create' && deckId
    ? deckStorage.getDeck(deckId)
    : mode === 'edit' && cardId
      ? cardStorage.getCard(cardId)?.deckId
        ? deckStorage.getDeck(cardStorage.getCard(cardId)!.deckId)
        : undefined
      : undefined

  // Check if we should disable the save button
  const isSaveDisabled = !front.trim() || !back.trim()

  // Handle save button click
  const handleSave = async () => {
    if (isSaveDisabled)
      return

    if (mode === 'create' && deckId) {
      // Create new card
      const card = await createNewCard(front, back, deckId, tags)
      if (card) {
        notifier.notify('Card created successfully')
        navigate(`/deck/${deckId}`)
      }
    }
    else if (mode === 'edit' && cardId) {
      // Update existing card
      const card = cardStorage.getCard(cardId)
      if (card) {
        const updatedCard = {
          ...card,
          front,
          back,
          tags,
        }
        cardStorage.updateCard(updatedCard)
        notifier.notify('Card updated successfully')
        navigate(`/deck/${card.deckId}`)
      }
    }
  }

  // Handle delete button click
  const handleDelete = () => {
    if (mode === 'edit' && cardId) {
      const card = cardStorage.getCard(cardId)
      if (card) {
        cardStorage.deleteCard(cardId)
        notifier.notify('Card deleted successfully')
        navigate(`/deck/${card.deckId}`)
      }
    }
  }

  if (!deck && mode === 'create') {
    // Redirect if we don't have a valid deck for creating
    navigate('/')
    return null
  }

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={3}>
            {mode === 'create' ? 'Create Card' : 'Edit Card'}
          </Title>

          {mode === 'edit' && (
            <ActionIcon color="red" onClick={deleteModal.open}>
            </ActionIcon>
          )}
        </Group>

        {deck && (
          <Text c="dimmed">
            Deck:
            {deck.title}
          </Text>
        )}

        <Textarea
          label="Front (Question)"
          placeholder="Enter the question or prompt"
          value={front}
          onChange={e => setFront(e.target.value)}
          autosize
          minRows={3}
          maxRows={6}
          required
        />

        <Textarea
          label="Back (Answer)"
          placeholder="Enter the answer or explanation"
          value={back}
          onChange={e => setBack(e.target.value)}
          autosize
          minRows={3}
          maxRows={6}
          required
        />

        <MultiSelect
          label="Tags"
          placeholder="Select or create tags"
          data={availableTags}
          value={tags}
          onChange={setTags}
          searchable
        />

        <CardPreview front={front} back={back} />

        <Group justify="space-between">
          <Button
            variant="outline"
            onClick={() => {
              if (mode === 'create' && deckId) {
                navigate(`/deck/${deckId}`)
              }
              else if (mode === 'edit' && cardId) {
                const card = cardStorage.getCard(cardId)
                if (card)
                  navigate(`/deck/${card.deckId}`)
              }
              else {
                navigate('/')
              }
            }}
          >
            Back to Deck
          </Button>

          <Button
            onClick={handleSave}
            disabled={isSaveDisabled}
          >
            {mode === 'create' ? 'Create Card' : 'Save Changes'}
          </Button>
        </Group>
      </Stack>

      <DeleteCardModal
        opened={deleteModalOpened}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
      />
    </Container>
  )
})
