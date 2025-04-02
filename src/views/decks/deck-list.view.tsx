import React from 'react'
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'

import type { Deck } from '../../domain/deck'

import { formatDate, formatRelativeTime } from '../../lib/datetime'

interface DeckListViewProps {
  decks: Deck[]
  loading: boolean
  onDeckClick: (deckId: string) => void
  onStudyClick: (deckId: string) => void
  onCreateClick: () => void
}

export const DeckListView: React.FC<DeckListViewProps> = ({
  decks,
  loading,
  onDeckClick,
  onStudyClick,
  onCreateClick,
}) => {
  if (loading) {
    return <Text>Loading decks...</Text>
  }

  return (
    <Stack gap="lg">
      {decks.length === 0
        ? (
            <Stack align="center" gap="md" my="xl">
              <Text c="dimmed">No decks found</Text>
              <Button onClick={onCreateClick}>
                Create your first deck
              </Button>
            </Stack>
          )
        : (
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {decks.map(deck => (
                <Card
                  key={deck.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  onClick={() => onDeckClick(deck.id)}
                >
                  <Stack gap="xs">
                    <Title order={3}>{deck.title}</Title>

                    {deck.description && (
                      <Text lineClamp={2} size="sm" c="dimmed">
                        {deck.description}
                      </Text>
                    )}

                    <Group gap="xs" mt="md">
                      <Badge color="blue">
                        {deck.cardCount}
                        {' '}
                        cards
                      </Badge>
                      {(deck.newCount + deck.reviewCount + deck.learningCount) > 0 && (
                        <Badge color="green">
                          {deck.newCount + deck.reviewCount + deck.learningCount}
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
                          onStudyClick(deck.id)
                        }}
                        disabled={deck.cardCount === 0}
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
              ))}
            </SimpleGrid>
          )}

      {decks.length > 0 && (
        <Group justify="center">
          <Button onClick={onCreateClick}>
            Create New Deck
          </Button>
        </Group>
      )}
    </Stack>
  )
}

