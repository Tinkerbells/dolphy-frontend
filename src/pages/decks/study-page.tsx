import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Group, Stack, Title } from '@mantine/core'

import { useDeckStore, useStudyStore } from '@/controllers/store'

import type { ReviewType } from '../../domain/study'

import { StudyCardView } from '../../views/study/study-card'
import { useTelegramService } from '../../services/telegram-service'

export const StudyPage = observer(() => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const studyStore = useStudyStore()
  const deckStore = useDeckStore()
  const telegram = useTelegramService()

  useEffect(() => {
    telegram.showBackButton(true)
    telegram.onBackButtonClick(() => navigate(`/deck/${deckId}`))

    if (deckId) {
      deckStore.selectDeck(deckId)
      studyStore.startStudySession(deckId)
    }

    return () => {
      telegram.showBackButton(false)
    }
  }, [deckId, deckStore, studyStore, telegram, navigate])

  const handleShowAnswer = () => {
    studyStore.revealAnswer()
  }

  const handleAnswerClick = (answer: ReviewType) => {
    studyStore.answerCard(answer)
  }

  const handleEndSession = () => {
    studyStore.endStudySession()
    navigate(`/deck/${deckId}`)
  }

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Title order={2}>
            Studying:
            {deckStore.selectedDeck?.title || 'Deck'}
          </Title>
        </Group>

        <StudyCardView
          card={studyStore.currentCard}
          showAnswer={studyStore.showAnswer}
          progress={studyStore.progress}
          onShowAnswerClick={handleShowAnswer}
          onAnswerClick={handleAnswerClick}
          onEndSessionClick={handleEndSession}
        />
      </Stack>
    </Container>
  )
})
