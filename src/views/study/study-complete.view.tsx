// src/views/study/study-complete.view.tsx

import type { FC } from 'react'

import React from 'react'
import { Button, Card, Group, RingProgress, Stack, Text, Title } from '@mantine/core'

interface StudyCompleteViewProps {
  deckName: string
  cardsStudied: number
  cardsCorrect: number
  onFinish: () => void
}

export const StudyCompleteView: FC<StudyCompleteViewProps> = ({
  deckName,
  cardsStudied,
  cardsCorrect,
  onFinish,
}) => {
  // Рассчитываем процент правильных ответов
  const correctPercent = cardsStudied > 0
    ? Math.round((cardsCorrect / cardsStudied) * 100)
    : 0

  return (
    <Card shadow="sm" padding="xl" radius="md" withBorder>
      <Stack align="center" gap="xl">
        <Title order={2}>Study Session Complete!</Title>

        <Text>
          You've completed your study session for
          <b>{deckName}</b>
          .
        </Text>

        <RingProgress
          size={180}
          thickness={16}
          roundCaps
          sections={[
            { value: correctPercent, color: 'green' },
            { value: 100 - correctPercent, color: 'gray' },
          ]}
          label={(
            <Text ta="center">
              <Text size="xl" fw={700}>
                {correctPercent}
                %
              </Text>
              <Text size="sm">Correct</Text>
            </Text>
          )}
        />

        <Group>
          <Stack gap={4} align="center">
            <Text size="xl" fw={700}>{cardsStudied}</Text>
            <Text size="sm">Cards Studied</Text>
          </Stack>

          <Stack gap={4} align="center">
            <Text size="xl" fw={700}>{cardsCorrect}</Text>
            <Text size="sm">Correct Answers</Text>
          </Stack>
        </Group>

        <Button size="lg" onClick={onFinish}>
          Finish
        </Button>
      </Stack>
    </Card>
  )
}
