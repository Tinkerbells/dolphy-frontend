import { ArrowLeft } from 'lucide-react'
import { observer } from 'mobx-react-lite'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ActionIcon, Button, Container, Group, Modal, Stack, Title } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'
import type { CardStore } from '@/controllers/card-store'

import { SYMBOLS } from '@/di/symbols'
import { withDependencies } from '@/di/inject'

import { CardFormView } from '../../views/cards/cards-form.view'
import { CardListView } from '../../views/cards/cards-list.view'

interface DeckDetailsPageProps {
  deckStore: DeckStore
  cardStore: CardStore
}

const DeckDetailsComponent = observer(({ deckStore, cardStore }: DeckDetailsPageProps) => {
  const { deckId } = useParams<{ deckId: string }>()
  const navigate = useNavigate()
  const [opened, { open, close }] = useDisclosure(false)
  const [front, setFront] = useState('')
  const [back, setBack] = useState('')

  useEffect(() => {
    if (deckId) {
      deckStore.selectDeck(deckId)
      cardStore.loadCardsByDeck(deckId)
    }
  }, [deckId, deckStore, cardStore, navigate])

  const handleCreateCard = async () => {
    if (!deckId)
      return

    const result = await cardStore.createCard(front, back, deckId)
    if (result) {
      setFront('')
      setBack('')
      close()
    }
  }

  const cards = cardStore.cardsByDeck(deckId || '')

  return (
    <Container p="md">
      <Stack gap="lg">
        <Group justify="space-between">
          <Group>
            <ActionIcon onClick={() => navigate('/')}>
              <ArrowLeft size={18} />
            </ActionIcon>
            <Title order={2}>{deckStore.selectedDeck?.title || 'Deck'}</Title>
          </Group>
          <Button onClick={() => navigate(`/study/${deckId}`)}>
            Study
          </Button>
        </Group>

        <CardListView
          cards={cards}
          loading={cardStore.isLoading}
          onCardClick={cardId => navigate(`/card/${cardId}`)}
          onAddClick={open}
        />
      </Stack>

      <Modal opened={opened} onClose={close} title="Add New Card">
        <CardFormView
          front={front}
          back={back}
          loading={cardStore.isLoading}
          onFrontChange={setFront}
          onBackChange={setBack}
          onSubmit={handleCreateCard}
          onCancel={close}
        />
      </Modal>
    </Container>
  )
})

export const DeckDetailsPage = withDependencies(
  DeckDetailsComponent,
  {
    deckStore: SYMBOLS.DeckStore,
    cardStore: SYMBOLS.CardStore,
  },
)
