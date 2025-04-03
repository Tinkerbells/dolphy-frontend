import { observer } from 'mobx-react-lite'
import { Plus, Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { ActionIcon, Button, Container, Drawer, Group, Stack, TextInput, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'

import { SYMBOLS } from '@/di/symbols'
import { FloatButton } from '@/views/common'
import { withDependencies } from '@/di/inject'

import styles from './decks-page.module.css'
import { DeckFormView } from '../../views/decks/deck-form.view'
import { DeckListView } from '../../views/decks/deck-list.view'

interface DecksPageProps {
  deckStore: DeckStore
}

const DecksPageComponent = observer(({ deckStore }: DecksPageProps) => {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [opened, { open, close }] = useDisclosure(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    deckStore.loadDecks()
  }, [deckStore])

  const filteredDecks = deckStore.filter(search)

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

      <Drawer position="bottom" opened={opened} onClose={close} title="Create New Deck">
        <DeckFormView
          title={title}
          description={description}
          loading={deckStore.isLoading}
          onTitleChange={setTitle}
          onDescriptionChange={setDescription}
          onSubmit={handleCreateDeck}
          onCancel={close}
        />
      </Drawer>
      <FloatButton onClick={open} placement="bottom-right" className={styles.floatButton}>
        <Plus />
      </FloatButton>
    </Container>
  )
})

export const DecksPage = withDependencies(
  DecksPageComponent,
  {
    deckStore: SYMBOLS.DeckStore,
  },
)
