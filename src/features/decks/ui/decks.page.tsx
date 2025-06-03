import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import AddIcon from '@mui/icons-material/Add'
import {
  Alert,
  Box,
  CircularProgress,
  Container,
  Fab,
  Grid,
  Typography,
} from '@mui/material'

import { useDecksModals } from './lib'
import { DeckCard } from './ui'
import { decksController } from '../controllers'

export const DecksPage = observer(() => {
  const { t } = useTranslation(['common', 'decks'])

  const { isLoading, decks, openUpdateModal, openDeleteModal, openCreateModal } = decksController

  useDecksModals(decksController)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {t('decks:title')}
        </Typography>
        {isLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
        {!isLoading && decks?.data.length === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
            {t('decks:noDecks')}
          </Alert>
        )}
        {decks && (
          <Grid container spacing={3}>
            {decks.data.map(deck => (
              <Grid key={deck.id} size={{ sm: 6, xs: 12, md: 4 }}>
                <DeckCard
                  deck={deck}
                  onEdit={openUpdateModal(deck)}
                  onDelete={openDeleteModal(deck.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
        <Fab
          color="primary"
          aria-label={t('decks:createDeck')}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={openCreateModal}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  )
})
