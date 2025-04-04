import { Plus, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import { useCallback, useEffect } from 'react'
import {
  ActionIcon,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  TextInput,
  Title,
} from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'

import { SYMBOLS } from '@/di/symbols'
import { useService } from '@/di/provider'
import { Drawer, FloatButton } from '@/views/ui'

import styles from './decks-page.module.css'
import { DeckFormView } from '../../views/decks/deck-form.view'
import { DeckListView } from '../../views/decks/deck-list.view'

export const DecksPage = observer(() => {
  const store = useService<DeckStore>(SYMBOLS.DeckStore)
  const navigate = useNavigate()

  useEffect(() => {
    store.loadDecks()
  }, [store])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    store.setSearchQuery(e.target.value)
  }, [store])

  const handleClearSearch = useCallback(() => {
    store.clearSearchQuery()
  }, [store])

  const handleDeckClick = useCallback((deckId: string) => {
    navigate(`/deck/${deckId}`)
  }, [navigate])

  const handleStudyClick = useCallback((deckId: string) => {
    navigate(`/study/${deckId}`)
  }, [navigate])

  const handleTitleChange = useCallback((value: string) => {
    store.setFormTitle(value)
  }, [store])

  const handleDescriptionChange = useCallback((value: string) => {
    store.setFormDescription(value)
  }, [store])

  return (
    <Container p="md" className={styles.deckPageContainer}>
      <LoadingOverlay visible={store.isLoading && !store.filteredDecks.length} />

      <Stack gap="lg" className={styles.stack}>
        <Group justify="space-between">
          <Title order={2}>My Decks</Title>
        </Group>

        <TextInput
          placeholder="Search decks..."
          value={store.searchQuery}
          onChange={handleSearchChange}
          rightSection={
            store.searchQuery
              ? (
                  <ActionIcon onClick={handleClearSearch} aria-label="Clear search">
                    <X size={16} />
                  </ActionIcon>
                )
              : null
          }
        />

        <DeckListView
          decks={store.filteredDecks}
          loading={store.isLoading}
          onDeckClick={handleDeckClick}
          onStudyClick={handleStudyClick}
          onCreateClick={() => store.changeOpen(true)}
        />
      </Stack>
      <Drawer.Root open={store.isFormDrawerOpen} onOpenChange={open => store.changeOpen(open)}>
        <Drawer.Content style={{
          height: '50%',
        }}
        >
          <DeckFormView
            title={store.formData.title}
            description={store.formData.description}
            loading={store.isLoading}
            onTitleChange={handleTitleChange}
            onDescriptionChange={handleDescriptionChange}
            onSubmit={store.submitDeckForm.bind(store)}
            onCancel={store.closeFormDrawer.bind(store)}
          />
        </Drawer.Content>
        <Drawer.Trigger asChild>
          <FloatButton
            placement="bottom-right"
            aria-label="Create new deck"
            className={styles.floatButton}
          >
            <Plus />
          </FloatButton>
        </Drawer.Trigger>
      </Drawer.Root>
    </Container>
  )
})
