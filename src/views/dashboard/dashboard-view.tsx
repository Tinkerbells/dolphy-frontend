// src/views/dashboard/dashboard-view.tsx

import React from 'react'
import { Book, BookOpen, ChevronRight, Plus } from 'lucide-react'
import { Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'

import type { DeckDto } from '@/models/decks'
import type { StudyStats } from '@/models/study-session'

import { formatRelativeTime } from '@/lib/datetime'

interface DashboardViewProps {
  decks: DeckDto[]
  stats: StudyStats | null
  onDeckClick: (deckId: string) => void
  onStudyClick: (deckId: string) => void
  onCreateDeckClick: () => void
  onViewAllStats: () => void
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  decks,
  stats,
  onDeckClick,
  onStudyClick,
  onCreateDeckClick,
  onViewAllStats,
}) => {
  // Получаем колоды с карточками для изучения
  const dueDecks = decks.filter(deck =>
    deck.newCount + deck.reviewCount + deck.learningCount > 0,
  )

  // Получаем недавно изученные колоды
  const recentDecks = [...decks]
    .filter(deck => deck.lastStudied)
    .sort((a, b) => {
      const dateA = a.lastStudied ? new Date(a.lastStudied).getTime() : 0
      const dateB = b.lastStudied ? new Date(b.lastStudied).getTime() : 0
      return dateB - dateA
    })
    .slice(0, 3)

  return (
    <Stack gap="xl">
      {/* Раздел с колодами для изучения */}
      <Stack gap="md">
        <Group position="apart">
          <Title order={3}>Decks to Study</Title>
          {dueDecks.length > 3 && (
            <Button
              variant="subtle"
              rightIcon={<ChevronRight size={16} />}
              onClick={() => {}}
            >
              View All
            </Button>
          )}
        </Group>

        {dueDecks.length > 0
          ? (
              <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
                {dueDecks.slice(0, 3).map(deck => (
                  <Card
                    key={deck.id}
                    shadow="sm"
                    padding="lg"
                    radius="md"
                    withBorder
                    onClick={() => onDeckClick(deck.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Stack gap="xs" justify="space-between" style={{ height: '100%' }}>
                      <Title order={4}>{deck.title}</Title>

                      <Group gap="xs">
                        <Text c="dimmed">
                          Due:
                          {deck.newCount + deck.reviewCount + deck.learningCount}
                          {' '}
                          cards
                        </Text>
                      </Group>

                      <Button
                        leftIcon={<BookOpen size={16} />}
                        onClick={(e) => {
                          e.stopPropagation()
                          onStudyClick(deck.id)
                        }}
                        fullWidth
                        mt="auto"
                      >
                        Study Now
                      </Button>
                    </Stack>
                  </Card>
                ))}
              </SimpleGrid>
            )
          : (
              <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack align="center" gap="md">
                  <Text c="dimmed">You're all caught up! No cards due for review.</Text>
                  <Button
                    leftIcon={<Plus size={16} />}
                    onClick={onCreateDeckClick}
                    variant="outline"
                  >
                    Create New Deck
                  </Button>
                </Stack>
              </Card>
            )}
      </Stack>

      {/* Раздел статистики */}
      <Stack gap="md">
        <Group position="apart">
          <Title order={3}>Your Progress</Title>
          <Button
            variant="subtle"
            rightIcon={<ChevronRight size={16} />}
            onClick={onViewAllStats}
          >
            View Stats
          </Button>
        </Group>

        <SimpleGrid cols={{ base: 1, md: 3 }}>
          <StatCard
            title="Total Cards Studied"
            value={stats ? stats.totalCards.toString() : '0'}
            icon={<Book size={24} />}
            color="blue"
          />

          <StatCard
            title="Current Streak"
            value={stats ? `${stats.streakDays} day${stats.streakDays !== 1 ? 's' : ''}` : '0 days'}
            icon={<Book size={24} />}
            color="green"
          />

          <StatCard
            title="Correct Rate"
            value={stats ? `${(stats.averageCorrectRate * 100).toFixed(1)}%` : '0%'}
            icon={<Book size={24} />}
            color="grape"
          />
        </SimpleGrid>
      </Stack>

      {/* Недавно изученные колоды */}
      {recentDecks.length > 0 && (
        <Stack gap="md">
          <Title order={3}>Recently Studied</Title>

          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
            {recentDecks.map(deck => (
              <Card
                key={deck.id}
                shadow="sm"
                padding="lg"
                radius="md"
                withBorder
                onClick={() => onDeckClick(deck.id)}
                style={{ cursor: 'pointer' }}
              >
                <Stack gap="xs">
                  <Title order={4}>{deck.title}</Title>

                  <Group gap="xs">
                    {deck.lastStudied && (
                      <Text c="dimmed" size="sm">
                        Last studied:
                        {' '}
                        {formatRelativeTime(deck.lastStudied)}
                      </Text>
                    )}
                  </Group>

                  <Text size="sm">
                    Progress:
                    {' '}
                    {Math.round(((deck.cardCount - (deck.newCount + deck.reviewCount + deck.learningCount)) / deck.cardCount) * 100)}
                    %
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      )}
    </Stack>
  )
}

// Компонент карточки со статистикой
interface StatCardProps {
  title: string
  value: string
  icon: React.ReactNode
  color: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => (
  <Card shadow="sm" padding="lg" radius="md" withBorder>
    <Stack align="center" gap="md">
      <div style={{
        width: 50,
        height: 50,
        borderRadius: '50%',
        backgroundColor: `var(--mantine-color-${color}-1)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: `var(--mantine-color-${color}-7)`,
      }}
      >
        {icon}
      </div>

      <Stack align="center">
        <Text fw={700} size="xl">{value}</Text>
        <Text c="dimmed" size="sm">{title}</Text>
      </Stack>
    </Stack>
  </Card>
)
