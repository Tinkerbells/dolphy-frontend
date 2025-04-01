import { observer } from 'mobx-react-lite'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core'

import type { ReviewType } from '../../domain/study'

import { useStudyDeck } from '../../application/study-deck'
import { useTelegram } from '../../services/telegram-adapter'
import { useDecksStorage } from '../../services/storage-adapter'

// Session summary modal
const StudySummaryModal: React.FC<{
  opened: boolean
  onClose: () => void
  sessionStats: {
    total: number
    correct: number
    timeSpent: number
  }
}> = ({ opened, onClose, sessionStats }) => {
  const { total, correct, timeSpent } = sessionStats
  const accuracy = total > 0 ? Math.round((correct / total) * 100) : 0

  // Format time spent in minutes and seconds
  const minutes = Math.floor(timeSpent / 60000)
  const seconds = Math.floor((timeSpent % 60000) / 1000)

  return (
    <Modal opened={opened} onClose={onClose} title="Study Session Summary">
      <Stack>
        <Group>
          <Text fw={500}>Cards studied:</Text>
          <Text>{total}</Text>
        </Group>

        <Group>
          <Text fw={500}>Correct answers:</Text>
          <Text>{correct}</Text>
        </Group>

        <Group>
          <Text fw={500}>Accuracy:</Text>
          <Text>
            {accuracy}
            %
          </Text>
        </Group>

        <Group>
          <Text fw={500}>Time spent:</Text>
          <Text>
            {minutes}
            m
            {' '}
            {seconds}
            s
          </Text>
        </Group>

        <Button mt="md" fullWidth onClick={onClose}>
          Close
        </Button>
      </Stack>
    </Modal>
  )
}

// Flashcard display component
const FlashCard: React.FC<{
  front: string
  back: string
  showAnswer: boolean
  onFlip: () => void
  onAnswer: (answer: ReviewType) => void
}> = ({ front, back, showAnswer, onFlip, onAnswer }) => {
  return (
    <Card shadow="md" padding="lg" radius="md" withBorder h={300}>
      <Stack justify="space-between" h="100%">
        <Box>
          {showAnswer
            ? (
                <>
                  <Text fw={500} mb="md">Question:</Text>
                  <Text size="lg">{front}</Text>
                  <Text fw={500} mt="xl" mb="md">Answer:</Text>
                  <Text size="lg">{back}</Text>
                </>
              )
            : (
                <>
                  <Text fw={500} mb="md">Question:</Text>
                  <Text size="lg">{front}</Text>
                </>
              )}
        </Box>

        {showAnswer
          ? (
              <Group grow>
                <Button color="red" onClick={() => onAnswer('again')}>
                  Again
                </Button>
                <Button color="orange" onClick={() => onAnswer('hard')}>
                  Hard
                </Button>
                <Button color="blue" onClick={() => onAnswer('good')}>
                  Good
                </Button>
                <Button color="green" onClick={() => onAnswer('easy')}>
                  Easy
                </Button>
              </Group>
            )
          : (
              <Button onClick={onFlip} fullWidth>
                Show Answer
              </Button>
            )}
      </Stack>
    </Card>
  )
}

// End session confirmation modal
const EndSessionModal: React.FC<{
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}> = ({ opened, onClose, onConfirm }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="End Study Session">
      <Stack>
        <Text>
          Are you sure you want to end this study session? Your progress will be saved.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>
            Continue Studying
          </Button>
          <Button color="red" onClick={onConfirm}>
            End Session
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

// Main study page component
export const StudyPage: React.FC = observer(() => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const telegram = useTelegram()
  const { getDeck } = useDecksStorage()
  const deck = deckId ? getDeck(deckId) : undefined

  const [endSessionOpened, endSessionModal] = useDisclosure(false)
  const [summaryOpened, summaryModal] = useDisclosure(false)
  const [sessionStats, setSessionStats] = useState({ total: 0, correct: 0, timeSpent: 0 })

  const {
    studyState,
    startStudySession,
    getCurrentCard,
    showAnswer,
    answerCard,
    endStudySession,
  } = useStudyDeck()

  // Initialize study session
  useEffect(() => {
    if (!deckId) {
      navigate('/')
      return
    }

    const session = startStudySession(deckId)
    if (!session) {
      // No cards to study or other error occurred
      navigate(`/deck/${deckId}`)
    }

    // Set page title

    // Set up back button
    telegram.showBackButton(true)
    const cleanup = telegram.onBackButtonClick(() => {
      endSessionModal.open()
    })

    return () => {
      cleanup()
    }
  }, [deckId, navigate, startStudySession, telegram])

  if (!deck || !studyState.studyCards.length)
    return null

  const currentCard = getCurrentCard()
  const progress = (studyState.currentCardIndex / studyState.studyCards.length) * 100

  // Handle answer selection
  const handleAnswer = (answer: ReviewType) => {
    if (!currentCard)
      return

    // Update stats for correct answers (good or easy)
    if (answer === 'good' || answer === 'easy') {
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
        correct: prev.correct + 1,
      }))
    }
    else {
      setSessionStats(prev => ({
        ...prev,
        total: prev.total + 1,
      }))
    }

    // Process the answer
    answerCard(answer)

    // Check if we've reached the end of the session
    if (studyState.currentCardIndex + 1 >= studyState.studyCards.length) {
      // Update time spent
      setSessionStats(prev => ({
        ...prev,
        timeSpent: Date.now() - studyState.startTime + prev.timeSpent,
      }))

      // Show summary
      summaryModal.open()
    }
  }

  // Handle end session
  const handleEndSession = () => {
    endStudySession()
    navigate(`/deck/${deckId}`)
  }

  // Handle study complete
  const handleStudyComplete = () => {
    navigate(`/deck/${deckId}`)
  }

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={3}>{deck.title}</Title>
          <Group>
            <ActionIcon
              variant="light"
              color="red"
              onClick={endSessionModal.open}
            >
            </ActionIcon>
          </Group>
        </Group>

        <Group>
          <Text>
            Card
            {' '}
            {studyState.currentCardIndex + 1}
            {' '}
            of
            {' '}
            {studyState.studyCards.length}
          </Text>

          <Badge color={studyState.showAnswer ? 'blue' : 'green'}>
            {studyState.showAnswer ? 'Answer' : 'Question'}
          </Badge>
        </Group>

        <Progress value={progress} size="sm" />

        {currentCard && (
          <FlashCard
            front={currentCard.front}
            back={currentCard.back}
            showAnswer={studyState.showAnswer}
            onFlip={showAnswer}
            onAnswer={handleAnswer}
          />
        )}
      </Stack>

      <EndSessionModal
        opened={endSessionOpened}
        onClose={endSessionModal.close}
        onConfirm={handleEndSession}
      />

      <StudySummaryModal
        opened={summaryOpened}
        onClose={handleStudyComplete}
        sessionStats={sessionStats}
      />
    </Container>
  )
})
