import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useTypedParams } from 'react-router-typesafe-routes'
import { observer, useLocalObservable } from 'mobx-react-lite'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fab,
  Grid,
  IconButton,
  Paper,
  Typography,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import { CardItem } from './ui'
import { useCardsModals } from './lib'
import { createDeckDetailController } from '../controllers'

export const DeckDetailPage = observer(() => {
  const { id: deckId } = useTypedParams(root.decks.detail)
  const { t } = useTranslation(['common', 'cards', 'decks'])

  const controller = useLocalObservable(createDeckDetailController(deckId!))

  const {
    isCardsLoading,
    cards,
    totalCardsCount,
    dueCardsCount,
    newCardsCount,
    masteredCardsCount,
    goBackToDecks,
    startStudy,
    openCreateModal,
    openDeleteModal,
  } = controller

  useCardsModals(controller)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" mb={3}>
          <IconButton onClick={goBackToDecks} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {t('cards:deckDetail')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={startStudy}
            disabled={dueCardsCount === 0}
            sx={{ mr: 2 }}
          >
            {t('cards:study')}
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {totalCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:totalCards')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">
                {dueCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:dueToday')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="info.main">
                {newCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:newCards')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">
                {masteredCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:mastered')}
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Cards List */}
        <Typography variant="h5" component="h2" gutterBottom>
          {t('cards:allCards')}
          {' '}
          (
          {totalCardsCount}
          )
        </Typography>

        {isCardsLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {!isCardsLoading && totalCardsCount === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
            {t('cards:noCards')}
          </Alert>
        )}

        {cards && cards.length > 0 && (
          <Box>
            {cards.map(card => (
              <CardItem
                key={card.id}
                card={card}
                onEdit={() => { /* TODO: Implement edit functionality */ }}
                onDelete={openDeleteModal(card.id)}
              />
            ))}
          </Box>
        )}
        <Fab
          color="primary"
          aria-label={t('cards:addCard')}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={openCreateModal}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  )
})
