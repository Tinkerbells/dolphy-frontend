// src/pages/stats/stats-page.tsx

import React, { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router'
import { ActionIcon, Button, Card, Container, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'
import type { StudySessionStore } from '@/controllers/study-session-store'

import { SYMBOLS } from '@/di/symbols'
import { Page } from '@/components/page'
import { withDependencies } from '@/di/inject'
import { StudyStatsView } from '@/views/stats/study-stats-view'
import { DeckStatsChart } from '@/views/stats/deck-stats-chart'

interface StatsPageProps {
  deckStore: DeckStore
  studySessionStore: StudySessionStore
}

const StatsPageComponent = observer(({
  deckStore,
  studySessionStore,
}: StatsPageProps) => {
  const navigate = useNavigate()

  useEffect(() => {
    const loadStats = async () => {
      // Загружаем все колоды и статистику пользователя
      await deckStore.loadDecks()
      await studySessionStore.loadUserStats()
    }

    loadStats()
  }, [deckStore, studySessionStore])

  // Если данные ещё не загрузились
  if (studySessionStore.isLoading || !studySessionStore.userStats) {
    return (
      <Page>
        <Container p="md">
          <Stack gap="lg">
            <Group>
              <ActionIcon variant="light" onClick={() => navigate('/decks')}>
                <ArrowLeft size={18} />
              </ActionIcon>
              <Title order={2}>Your Study Statistics</Title>
            </Group>
            <Text>Loading statistics...</Text>
          </Stack>
        </Container>
      </Page>
    )
  }

  return (
    <Page>
      <Container p="md">
        <Stack gap="lg">
          <Group>
            <ActionIcon variant="light" onClick={() => navigate('/decks')}>
              <ArrowLeft size={18} />
            </ActionIcon>
            <Title order={2}>Your Study Statistics</Title>
          </Group>

          <StudyStatsView stats={studySessionStore.userStats} />

          <Title order={3} mt="md">Decks Progress</Title>

          <SimpleGrid cols={{ base: 1, sm: 2 }}>
            {deckStore.decks.decks.length > 0
              ? (
                  deckStore.decks.decks.map(deck => (
                    <Card key={deck.id} shadow="sm" padding="lg" radius="md" withBorder>
                      <Title order={4}>{deck.title}</Title>
                      <DeckStatsChart deck={deck} />

                      <Group mt="md">
                        <Button
                          variant="light"
                          size="sm"
                          onClick={() => navigate(`/deck/${deck.id}`)}
                        >
                          View Deck
                        </Button>
                      </Group>
                    </Card>
                  ))
                )
              : (
                  <Text c="dimmed">No decks available.</Text>
                )}
          </SimpleGrid>
        </Stack>
      </Container>
    </Page>
  )
})

export const StatsPage = withDependencies(
  StatsPageComponent,
  {
    deckStore: SYMBOLS.DeckStore,
    studySessionStore: SYMBOLS.StudySessionStore,
  },
)
