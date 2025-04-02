import React from 'react'
import { Badge, Button, Card, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core'

import type { Card as CardModel } from '../../domain/card'

import { formatDate } from '../../lib/datetime'

interface CardListViewProps {
  cards: CardModel[]
  loading: boolean
  onCardClick: (cardId: string) => void
  onAddClick: () => void
}

export const CardListView: React.FC<CardListViewProps> = ({
  cards,
  loading,
  onCardClick,
  onAddClick,
}) => {
  if (loading) {
    return <Text>Loading cards...</Text>
  }

  return (
    <Stack gap="lg">
      {cards.length === 0
        ? (
            <Stack align="center" gap="md" my="xl">
              <Text c="dimmed">No cards in this deck</Text>
              <Button onClick={onAddClick}>
                Add your first card
              </Button>
            </Stack>
          )
        : (
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {cards.map(card => (
                <Card
                  key={card.id}
                  shadow="sm"
                  padding="lg"
                  radius="md"
                  withBorder
                  onClick={() => onCardClick(card.id)}
                >
                  <Stack gap="xs">
                    <Title order={4}>Front</Title>
                    <Text lineClamp={3}>{card.front}</Text>

                    <Title order={4} mt="sm">Back</Title>
                    <Text lineClamp={3}>{card.back}</Text>

                    <Group gap="xs" mt="md">
                      <Badge color={getStatusColor(card.status)}>
                        {getStatusLabel(card.status)}
                      </Badge>
                      {card.tags.map(tag => (
                        <Badge key={tag} color="blue" variant="light">
                          {tag}
                        </Badge>
                      ))}
                    </Group>

                    <Text size="xs" c="dimmed" mt="sm">
                      Created:
                      {' '}
                      {formatDate(card.created)}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          )}

      <Group justify="center">
        <Button onClick={onAddClick}>
          Add New Card
        </Button>
      </Group>
    </Stack>
  )
}

// Utility functions for card status
function getStatusColor(status: StudyStatus): string {
  switch (status) {
    case 'new': return 'green'
    case 'learning': return 'blue'
    case 'review': return 'yellow'
    case 'relearning': return 'red'
    default: return 'gray'
  }
}

function getStatusLabel(status: StudyStatus): string {
  switch (status) {
    case 'new': return 'New'
    case 'learning': return 'Learning'
    case 'review': return 'Review'
    case 'relearning': return 'Relearning'
    default: return 'Unknown'
  }
}
