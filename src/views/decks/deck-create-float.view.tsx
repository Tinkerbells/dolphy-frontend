import { Button } from '@mantine/core'

import type { DeckStore } from '@/controllers/deck-store'

import { SYMBOLS } from '@/di/symbols'
import { withDependencies } from '@/di/inject'

interface DeckCreateFloatComponentProps {
  deckStore: DeckStore
}
export function DeckCreateFloatComponent({ deckStore }: DeckCreateFloatComponentProps) {
  const handleCreateDeck = async () => {
    const result = await deckStore.createDeck(title, description)
    if (result) {
      close()
    }
  }
  return <Button></Button>
}

export const DecksPage = withDependencies(
  DeckCreateFloatComponent,
  {
    deckStore: SYMBOLS.DeckStore,
  },
)
