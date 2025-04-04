import { Plus, X } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useCallback, useEffect } from 'react'
import { withErrorBoundary } from 'react-error-boundary'
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
import { withDependencies } from '@/di/inject'
import { Drawer, FloatButton, Page } from '@/views/common'
import { withBottomNavigation } from '@/views/common/hocs'
import { compose, ErrorHandler, logError } from '@/lib/react'

import styles from './decks-page.module.css'
import { DeckFormView } from '../../views/decks/deck-form.view'
import { DeckListView } from '../../views/decks/deck-list.view'

interface DecksPageProps {
  deckStore: DeckStore
}

const enhance = compose<DecksPageProps>(
  component =>
    withErrorBoundary(component, {
      FallbackComponent: ErrorHandler,
      onError: logError,
    }),
  component =>
    withDependencies(component, {
      deckStore: SYMBOLS.DeckStore,
    }),
  component =>
    withBottomNavigation(component),
)

export const DecksPage = enhance(observer(({ deckStore }: DecksPageProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    deckStore.loadDecks()
  }, [deckStore])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    deckStore.setSearchQuery(e.target.value)
  }, [deckStore])

  const handleClearSearch = useCallback(() => {
    deckStore.clearSearchQuery()
  }, [deckStore])

  const handleDeckClick = useCallback((deckId: string) => {
    navigate(`/deck/${deckId}`)
  }, [navigate])

  const handleStudyClick = useCallback((deckId: string) => {
    navigate(`/study/${deckId}`)
  }, [navigate])

  const handleTitleChange = useCallback((value: string) => {
    deckStore.setFormTitle(value)
  }, [deckStore])

  const handleDescriptionChange = useCallback((value: string) => {
    deckStore.setFormDescription(value)
  }, [deckStore])

  return (
    <Page>
      <Container p="md" className={styles.deckPageContainer}>
        <LoadingOverlay visible={deckStore.isLoading && !deckStore.filteredDecks.length} />

        <Stack gap="lg" className={styles.stack}>
          <Group justify="space-between">
            <Title order={2}>My Decks</Title>
          </Group>

          <TextInput
            placeholder="Search decks..."
            value={deckStore.searchQuery}
            onChange={handleSearchChange}
            rightSection={
              deckStore.searchQuery
                ? (
                    <ActionIcon onClick={handleClearSearch} aria-label="Clear search">
                      <X size={16} />
                    </ActionIcon>
                  )
                : null
            }
          />

          <DeckListView
            decks={deckStore.filteredDecks}
            loading={deckStore.isLoading}
            onDeckClick={handleDeckClick}
            onStudyClick={handleStudyClick}
            onCreateClick={() => deckStore.changeOpen(true)}
          />
        </Stack>
        <Drawer.Root open={deckStore.isFormDrawerOpen} onOpenChange={open => deckStore.changeOpen(open)}>
          <Drawer.Content style={{
            height: '50%',
          }}
          >
            <DeckFormView
              title={deckStore.formData.title}
              description={deckStore.formData.description}
              loading={deckStore.isLoading}
              onTitleChange={handleTitleChange}
              onDescriptionChange={handleDescriptionChange}
              onSubmit={deckStore.submitDeckForm.bind(deckStore)}
              onCancel={deckStore.closeFormDrawer.bind(deckStore)}
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
    </Page>
  )
}))
