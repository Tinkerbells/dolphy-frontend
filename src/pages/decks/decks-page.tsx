import { Search, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { ActionIcon, Container, Group, Modal, Stack, TextInput, Title } from '@mantine/core'

import { useDeckStore } from '@/controllers/store'

import { DeckFormView } from '../../views/decks/deck-form.view'
import { DeckListView } from '../../views/decks/deck-list.view'
import { useTelegramService } from '../../services/telegram-service'

export const DecksPage = observer(() => {
  const navigate = useNavigate()
  const deckStore = useDeckStore()
  const telegram = useTelegramService()
  const [search, setSearch] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    telegram.showBackButton(false)
    deckStore.loadDecks()
  }, [telegram, deckStore])

  const filteredDecks = deckStore.decks.filter(deck =>
    deck.title.toLowerCase().includes(search.toLowerCase())
    || deck.description.toLowerCase().includes(search.toLowerCase()),
  )

  const handleCreateDeck = async () => {
    const result = await deckStore.createDeck(title, description)
    if (result) {
      setTitle('')
      setDescription('')
      close()
    }
  }

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>My Decks</Title>
          <Group>
            <ActionIcon variant="filled" color="blue" onClick={() => navigate('/settings')}>
              <Search size={18} />
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
                    <X size={16} />
                  </ActionIcon>
                )
              : null
          }
        />

        <DeckListView
          decks={filteredDecks}
          loading={deckStore.isLoading}
          onDeckClick={deckId => navigate(`/deck/${deckId}`)}
          onStudyClick={deckId => navigate(`/study/${deckId}`)}
          onCreateClick={open}
        />
      </Stack>

      <Modal opened={opened} onClose={close} title="Create New Deck">
        <DeckFormView
          title={title}
          description={description}
          loading={deckStore.isLoading}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={handleCreateDeck}
          onCancel={close}
        />
      </Modal>
    </Container>
  )
})
