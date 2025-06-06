import { observer } from 'mobx-react-lite'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import {
  Alert,
  AppBar,
  Box,
  CircularProgress,
  Container,
  Fab,
  Grid,
  Toolbar,
  Typography,
} from '@mui/material'

import { useInjected } from '@/core/presentation/react'

import { DecksStore } from './store/decks.store'
import { DeckCard } from './components/deck-card'

export const DecksPage = observer(() => {
  const { t } = useTranslation(['common', 'decks'])

  const decksStore = useInjected<DecksStore>(DecksStore)

  const { data: decksData, isLoading, isError, error } = decksStore.decks.result

  const handleCreateDeck = () => {
    // decksStore.openCreateDeckDialog()
  }

  const handleEditDeck = (deckId: string) => {
    const deck = decksData?.data.find(d => d.id === deckId)
    if (deck) {
      // decksStore.openEditDeckDialog(deck)
    }
  }

  const handleDeleteDeck = (deckId: string) => {
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Хедер с логотипом */}
      <AppBar position="static" color="primary" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dolphy
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('decks:title')}
        </Typography>
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {isError && (
          <Alert severity="error" sx={{ my: 2 }}>
            {error?.message || t('common:error')}
          </Alert>
        )}

        {!isLoading && !isError && decksData?.data.length === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
            {t('decks:noDecks')}
          </Alert>
        )}

        {decksData && (
          <Grid container spacing={3}>
            {decksData.data.map(deck => (
              <Grid key={deck.id}>
                <DeckCard
                  deck={deck}
                  onEdit={() => handleEditDeck(deck.id)}
                  onDelete={() => handleDeleteDeck(deck.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}

        {/* Кнопка добавления новой колоды */}
        <Fab
          color="primary"
          aria-label={t('decks:createDeck')}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={handleCreateDeck}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  )
})
