// src/pages/study/study-page.tsx

import { observer } from 'mobx-react-lite'
import React, { useEffect, useState } from 'react'
import { ArrowLeft, Check, X } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActionIcon, Button, Card, Container, Group, Progress, Stack, Text, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'
import type { StudySessionStore } from '@/controllers/study-session-store'

import { SYMBOLS } from '@/di/symbols'
import { Page } from '@/components/page'
import { withDependencies } from '@/di/inject'
import { StudyCardView } from '@/views/study/study-card.view'
import { StudyCompleteView } from '@/views/study/study-complete.view'

interface StudyPageProps {
  deckStore: DeckStore
  studySessionStore: StudySessionStore
}

const StudyPageComponent = observer(({
  deckStore,
  studySessionStore,
}: StudyPageProps) => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const [isFlipped, setIsFlipped] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!deckId) {
      navigate('/decks')
      return
    }

    // Загружаем колоду и начинаем сессию
    const loadDeckAndStartSession = async () => {
      setIsLoading(true)
      const deck = await deckStore.loadDeck(deckId)

      if (!deck) {
        navigate('/decks')
        return
      }

      // Начинаем сессию изучения
      const success = await studySessionStore.startStudySession(deckId, 20)
      if (!success) {
        navigate(`/deck/${deckId}`)
      }

      setIsLoading(false)
    }

    loadDeckAndStartSession()

    // При размонтировании компонента завершаем сессию, если она активна
    return () => {
      if (studySessionStore.isSessionActive) {
        studySessionStore.endStudySession()
      }
    }
  }, [deckId, navigate, deckStore, studySessionStore])

  // Обработчики действий с карточкой
  const handleCardFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (answer: 'again' | 'hard' | 'good' | 'easy') => {
    // Сбрасываем состояние карточки
    setIsFlipped(false)

    // Записываем ответ и переходим к следующей карточке
    studySessionStore.answerCard(answer)
  }

  const handleFinish = () => {
    navigate(`/deck/${deckId}`)
  }

  // Если загружаем данные
  if (isLoading) {
    return (
      <Page>
        <Container>
          <Text>Loading study session...</Text>
        </Container>
      </Page>
    )
  }

  // Если нет текущей карточки (сессия завершена)
  if (!studySessionStore.currentCard) {
    return (
      <Page>
        <Container>
          <StudyCompleteView
            deckName={deckStore.currentDeck?.title || 'Deck'}
            cardsStudied={studySessionStore.currentSession?.cardsStudied || 0}
            cardsCorrect={studySessionStore.currentSession?.cardsCorrect || 0}
            onFinish={handleFinish}
          />
        </Container>
      </Page>
    )
  }

  return (
    <Page>
      <Container>
        <Stack gap="lg">
          <Group justify="space-between">
            <Group>
              <ActionIcon variant="light" onClick={() => navigate(`/deck/${deckId}`)}>
                <ArrowLeft size={18} />
              </ActionIcon>
              <Title order={3}>
                Study
                {deckStore.currentDeck?.title}
              </Title>
            </Group>
            <Text>
              {studySessionStore.remainingCards}
              {' '}
              cards left
            </Text>
          </Group>

          <Progress
            value={studySessionStore.sessionProgress}
            size="sm"
            color="blue"
          />

          <StudyCardView
            card={studySessionStore.currentCard}
            isFlipped={isFlipped}
            onFlip={handleCardFlip}
            onAnswer={handleAnswer}
          />

          {/* Показываем кнопки ответа только если карточка перевернута */}
          {isFlipped && (
            <Card shadow="sm" withBorder p="md">
              <Group justify="center" grow>
                <Button
                  color="red"
                  onClick={() => handleAnswer('again')}
                  leftSection={<X size={18} />}
                >
                  Again
                </Button>
                <Button
                  color="orange"
                  onClick={() => handleAnswer('hard')}
                >
                  Hard
                </Button>
                <Button
                  color="green"
                  onClick={() => handleAnswer('good')}
                >
                  Good
                </Button>
                <Button
                  color="blue"
                  onClick={() => handleAnswer('easy')}
                  rightSection={<Check size={18} />}
                >
                  Easy
                </Button>
              </Group>
            </Card>
          )}
        </Stack>
      </Container>
    </Page>
  )
})

export const StudyPage = withDependencies(
  StudyPageComponent,
  {
    deckStore: SYMBOLS.DeckStore,
    studySessionStore: SYMBOLS.StudySessionStore,
  },
)
