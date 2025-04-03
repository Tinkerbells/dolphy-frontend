// src/views/cards/card-list.view.tsx

import React from 'react'
import { Edit, Trash } from 'lucide-react'
import { ActionIcon, Badge, Card, Group, SimpleGrid, Stack, Text } from '@mantine/core'

import type { CardDto } from '@/models/cards'

import { formatRelativeTime } from '@/lib/datetime'

interface CardListViewProps {
  cards: CardDto[]
  loading: boolean
  onCardClick: (cardId: string) => void
  onEditClick: (cardId: string) => void
  onDeleteClick: (cardId: string) => void
}

export const CardListView: React.FC<CardListViewProps> = ({
  cards,
  loading,
  onCardClick,
  onEditClick,
  onDeleteClick,
}) => {
  if (loading) {
    return <Text>Loading cards...</Text>
  }

  if (cards.length === 0) {
    return (
      <Text c="dimmed" ta="center">No cards found</Text>
    )
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'new': return 'blue'
      case 'learning': return 'green'
      case 'relearning': return 'orange'
      case 'review': return 'grape'
      default: return 'gray'
    }
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2 }}>
      {cards.map(card => (
        <Card
          key={card.id}
          shadow="sm"
          padding="lg"
          radius="md"
          withBorder
          onClick={() => onCardClick(card.id)}
          style={{ cursor: 'pointer' }}
        >
          <Stack gap="xs" justify="space-between" style={{ height: '100%' }}>
            <Text fw={500} lineClamp={2}>
              {card.front}
            </Text>

            <Group gap="xs" mt="md">
              <Badge color={getStatusColor(card.status)}>
                {card.status}
              </Badge>

              <Badge color="gray">
                Difficulty:
                {' '}
                {card.difficulty}
              </Badge>

              {card.dueDate && (
                <Badge color="blue">
                  Due:
                  {' '}
                  {formatRelativeTime(card.dueDate)}
                </Badge>
              )}
            </Group>

            <Group gap="xs" mt="auto">
              {card.tags.map(tag => (
                <Badge key={tag} size="xs">
                  {tag}
                </Badge>
              ))}
            </Group>

            <Group position="right" mt="md">
              <ActionIcon
                onClick={(e) => {
                  e.stopPropagation()
                  onEditClick(card.id)
                }}
              >
                <Edit size={16} />
              </ActionIcon>

              <ActionIcon
                color="red"
                onClick={(e) => {
                  e.stopPropagation()
                  onDeleteClick(card.id)
                }}
              >
                <Trash size={16} />
              </ActionIcon>
            </Group>
          </Stack>
        </Card>
      ))}
    </SimpleGrid>
  )
}
