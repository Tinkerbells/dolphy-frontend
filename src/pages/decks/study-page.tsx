import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate, useParams } from 'react-router-dom'
import { Container, Group, Stack, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'
import type { StudyStore } from '@/controllers/study-store'

import { SYMBOLS } from '@/di/symbols'
import { withDependencies } from '@/di/inject'

import type { ReviewType } from '../../domain/study'

import { StudyCardView } from '../../views/study/study-card'

interface StudyPageProps {
  deckStore: DeckStore
  studyStore: StudyStore
}

const StudyPageComponent = observer(({ deckStore, studyStore }: StudyPageProps) => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()

  useEffect(() => {
    if (deckId) {
      deckStore.selectDeck(deckId)
      studyStore.startStudySession(deckId)
    }
  }, [deckId, deckStore, studyStore, navigate])

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

export const StudyPage = withDependencies(
  StudyPageComponent,
  {
    deckStore: SYMBOLS.DeckStore,
    studyStore: SYMBOLS.StudyStore,
  },
)
