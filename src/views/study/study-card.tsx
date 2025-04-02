import React from 'react'
import { Button, Card, Group, Progress, Stack, Text, Title } from '@mantine/core'

import type { Card as CardModel } from '../../domain/card'

interface StudyCardViewProps {
  card?: CardModel
  showAnswer: boolean
  progress: number
  onShowAnswerClick: () => void
  onAnswerClick: (answer: 'again' | 'hard' | 'good' | 'easy') => void
  onEndSessionClick: () => void
}

export const StudyCardView: React.FC<StudyCardViewProps> = ({
  card,
  showAnswer,
  progress,
  onShowAnswerClick,
  onAnswerClick,
  onEndSessionClick,
}) => {
  if (!card) {
    return (
      <Stack align="center" gap="md" mt="xl">
        <Text c="dimmed">No cards to study</Text>
        <Button onClick={onEndSessionClick}>
          Return to Deck
        </Button>
      </Stack>
    )
  }

  return (
    <Stack>
      <Progress value={progress} size="sm" mb="md" />

      <Card shadow="sm" padding="xl" radius="md" withBorder>
        <Stack gap="xl">
          <Title order={3} ta="center">Question</Title>
          <Text size="xl" ta="center">{card.front}</Text>

          {showAnswer
            ? (
                <>
                  <Title order={3} ta="center" mt="xl">Answer</Title>
                  <Text size="xl" ta="center">{card.back}</Text>

                  <Group justify="center" mt="xl">
                    <Button
                      color="red"
                      onClick={() => onAnswerClick('again')}
                    >
                      Again
                    </Button>
                    <Button
                      color="orange"
                      onClick={() => onAnswerClick('hard')}
                    >
                      Hard
                    </Button>
                    <Button
                      color="green"
                      onClick={() => onAnswerClick('good')}
                    >
                      Good
                    </Button>
                    <Button
                      color="blue"
                      onClick={() => onAnswerClick('easy')}
                    >
                      Easy
                    </Button>
                  </Group>
                </>
              )
            : (
                <Group justify="center" mt="xl">
                  <Button onClick={onShowAnswerClick}>
                    Show Answer
                  </Button>
                </Group>
              )}

          <Group justify="flex-end">
            <Button variant="subtle" onClick={onEndSessionClick}>
              End Session
            </Button>
          </Group>
        </Stack>
      </Card>
    </Stack>
  )
}
