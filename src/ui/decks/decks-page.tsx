import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Container,
  Flex,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'

import type { CreateDeckService } from '@/application/create-deck'

import type { Deck } from '../../domain/deck'
import type { AppStore } from '../../services/store'
import type { CardStorageService, TelegramService } from '../../application/ports'

import { SYMBOLS } from '../../di/symbols'
import { withDependencies } from '../../di/inject'
import { formatDate, formatRelativeTime } from '../../lib/datetime'

interface DeckCardProps {
  deck: Deck
  cardStorage?: CardStorageService
}

const DeckCard: React.FC<DeckCardProps> = observer(({ deck }) => {
  const navigate = useNavigate()

  const dueCount = deck.newCount + deck.reviewCount + deck.learningCount

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder onClick={() => navigate(`/deck/${deck.id}`)}>
      <Stack gap="xs">
        <Title order={3}>{deck.title}</Title>

        {deck.description && (
          <Text lineClamp={2} size="sm" c="dimmed">
            {deck.description}
          </Text>
        )}

        <Group gap="xs" mt="md">
          <Badge color="blue">
            {/* {deckCards.length} */}
            {' '}
            cards
          </Badge>
          {dueCount > 0 && (
            <Badge color="green">
              {dueCount}
              {' '}
              due
            </Badge>
          )}
          {deck.lastStudied && (
            <Badge color="gray">
              Last studied:
              {' '}
              {formatRelativeTime(deck.lastStudied)}
            </Badge>
          )}
        </Group>

        <Group justify="space-between" mt="md">
          <Button
            variant="light"
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/study/${deck.id}`)
            }}
            // disabled={deckCards.length === 0}
          >
            Study Now
          </Button>

          <Text size="xs" c="dimmed">
            Created:
            {' '}
            {formatDate(deck.created)}
          </Text>
        </Group>
      </Stack>
    </Card>
  )
})

interface CreateDeckModalProps {
  opened: boolean
  onClose: () => void
  createDeckService?: CreateDeckService
}

const CreateDeckModal: React.FC<CreateDeckModalProps> = ({
  opened,
  onClose,
  createDeckService,
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = async () => {
    if (createDeckService) {
      const deck = await createDeckService.createNewDeck(title, description)
      if (deck) {
        onClose()
      }
    }
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Create New Deck">
      <Stack>
        <TextInput
          label="Deck Title"
          placeholder="Enter deck title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />

        <TextInput
          label="Description"
          placeholder="Enter deck description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={!title.trim()}>Create Deck</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

const InjectedCreateDeckModal = withDependencies(CreateDeckModal, {
  createDeckService: SYMBOLS.CreateDeckService,
})

interface DecksPageProps {
  telegram: TelegramService
  store: AppStore
}

const DecksPageComponent: React.FC<DecksPageProps> = observer(({ telegram, store }) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [opened, { open, close }] = useDisclosure(false)

  useEffect(() => {
    telegram.showBackButton(false)
  }, [telegram])

  const filteredDecks = store.decks.filter(deck =>
    deck.title.toLowerCase().includes(search.toLowerCase())
    || deck.description.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>My Decks</Title>
          <Group>
            <ActionIcon variant="filled" color="blue" onClick={() => navigate('/settings')}>
            </ActionIcon>
          </Group>
        </Group>

        <TextInput
          placeholder="Search decks..."
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

        {filteredDecks.length === 0
          ? (
              <Stack align="center" gap="md" my="xl">
                <Text c="dimmed">No decks found</Text>
                <Button onClick={open}>
                  Create your first deck
                </Button>
              </Stack>
            )
          : (
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                {filteredDecks.map(deck => (
                  <DeckCard key={deck.id} deck={deck} />
                ))}
              </SimpleGrid>
            )}

        <Flex justify="center">
          <Button onClick={open}>
            Create New Deck
          </Button>
        </Flex>
      </Stack>

      <InjectedCreateDeckModal opened={opened} onClose={close} />
    </Container>
  )
})

export const DecksPage = withDependencies(DecksPageComponent, {
  telegram: SYMBOLS.TelegramService,
  store: SYMBOLS.AppStore,
})
