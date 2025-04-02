import React from 'react'
import { Book, Edit, Play, Trash } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  Group,
  RingProgress,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import type { DeckDto } from '../../models/decks'

import { formatDate, formatRelativeTime } from '../../lib/datetime'

interface DeckDetailViewProps {
  deck: DeckDto
  loading: boolean
  onEditClick: () => void
  onDeleteClick: () => void
  onStudyClick: () => void
  onManageCardsClick: () => void
}

export const DeckDetailView: React.FC<DeckDetailViewProps> = ({
  deck,
  loading,
  onEditClick,
  onDeleteClick,
  onStudyClick,
  onManageCardsClick,
}) => {
  if (loading) {
    return <Text>Loading deck details...</Text>
  }

  // Calculate total due cards and percentages for the ring progress
  const totalDue = deck.newCount + deck.reviewCount + deck.learningCount
  const newPercent = deck.cardCount > 0 ? (deck.newCount / deck.cardCount) * 100 : 0
  const reviewPercent = deck.cardCount > 0 ? (deck.reviewCount / deck.cardCount) * 100 : 0
  const learningPercent = deck.cardCount > 0 ? (deck.learningCount / deck.cardCount) * 100 : 0
  const completedPercent = 100 - newPercent - reviewPercent - learningPercent

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="flex-start">
            <Stack gap={5}>
              <Title order={2}>{deck.title}</Title>
              <Text c="dimmed" size="sm">
                Created:
                {' '}
                {formatDate(deck.created)}
              </Text>
            </Stack>
            <Group>
              <Button variant="light" leftSection={<Edit size={16} />} onClick={onEditClick}>
                Edit
              </Button>
              <Button variant="light" color="red" leftSection={<Trash size={16} />} onClick={onDeleteClick}>
                Delete
              </Button>
            </Group>
          </Group>

          {deck.description && (
            <Text>
              {deck.description}
            </Text>
          )}

          {deck.tags.length > 0 && (
            <Group gap={8}>
              {deck.tags.map(tag => (
                <Badge key={tag} size="md">
                  {tag}
                </Badge>
              ))}
            </Group>
          )}
        </Stack>
      </Card>

      <Group grow>
        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack align="center" gap="md">
            <RingProgress
              size={180}
              thickness={16}
              roundCaps
              sections={[
                { value: newPercent, color: 'blue' },
                { value: reviewPercent, color: 'grape' },
                { value: learningPercent, color: 'green' },
                { value: completedPercent, color: 'gray' },
              ]}
              label={(
                <Text ta="center">
                  <Text size="xl" fw={700}>
                    {deck.cardCount}
                  </Text>
                  <Text size="sm">Cards</Text>
                </Text>
              )}
            />

            <Stack gap={8} align="center">
              <Group gap={8}>
                <Badge color="blue" size="lg">
                  New:
                  {deck.newCount}
                </Badge>
                <Badge color="grape" size="lg">
                  Review:
                  {deck.reviewCount}
                </Badge>
                <Badge color="green" size="lg">
                  Learning:
                  {deck.learningCount}
                </Badge>
              </Group>

              {deck.lastStudied && (
                <Text size="sm" c="dimmed">
                  Last studied:
                  {' '}
                  {formatRelativeTime(deck.lastStudied)}
                </Text>
              )}
            </Stack>
          </Stack>
        </Card>

        <Card shadow="sm" padding="lg" radius="md" withBorder>
          <Stack justify="space-between" h="100%">
            <Stack gap="md">
              <Title order={3}>Ready to Study?</Title>

              <Text>
                {totalDue > 0
                  ? `You have ${totalDue} cards due for review.`
                  : 'All caught up! No cards due for review.'}
              </Text>
            </Stack>

            <Group grow>
              <Button
                leftSection={<Book size={18} />}
                variant="light"
                onClick={onManageCardsClick}
              >
                Manage Cards
              </Button>

              <Button
                leftSection={<Play size={18} />}
                onClick={onStudyClick}
                disabled={deck.cardCount === 0}
              >
                Study Now
              </Button>
            </Group>
          </Stack>
        </Card>
      </Group>
    </Stack>
  )
}
