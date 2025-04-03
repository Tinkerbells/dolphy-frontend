// src/views/cards/study-card.view.tsx

import type { FC } from 'react'

import React from 'react'
import { Badge, Card, Group, Text } from '@mantine/core'

import type { CardDto } from '@/models/cards'

interface StudyCardViewProps {
  card: CardDto
  isFlipped: boolean
  onFlip: () => void
  onAnswer?: (answer: 'again' | 'hard' | 'good' | 'easy') => void
}

export const StudyCardView: FC<StudyCardViewProps> = ({
  card,
  isFlipped,
  onFlip,
}) => {
  const renderStatusBadge = () => {
    const statusColors: Record<string, string> = {
      new: 'blue',
      learning: 'green',
      relearning: 'orange',
      review: 'grape',
    }

    return (
      <Badge color={statusColors[card.status]} size="sm">
        {card.status}
      </Badge>
    )
  }

  return (
    <Card
      shadow="sm"
      padding="xl"
      radius="md"
      withBorder
      style={{
        minHeight: '250px',
        cursor: 'pointer',
      }}
      onClick={onFlip}
    >
      <Card.Section withBorder p="xs">
        <Group justify="space-between">
          <Text size="sm" fw={500}>
            {isFlipped ? 'Answer' : 'Question'}
          </Text>
          {renderStatusBadge()}
        </Group>
      </Card.Section>

      <Text
        size="xl"
        fw={500}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '180px',
          textAlign: 'center',
          padding: '20px',
        }}
      >
        {isFlipped ? card.back : card.front}
      </Text>

      <Card.Section withBorder p="xs" mt="auto">
        <Group>
          {card.tags.map(tag => (
            <Badge key={tag} size="xs" color="gray">
              {tag}
            </Badge>
          ))}
        </Group>
      </Card.Section>
    </Card>
  )
}
