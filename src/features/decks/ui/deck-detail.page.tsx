import { useMemo } from 'react'
import AddIcon from '@mui/icons-material/Add'
import { useTranslation } from 'react-i18next'
import HomeIcon from '@mui/icons-material/Home'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useTypedParams, useTypedState } from 'react-router-typesafe-routes'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fab,
  Grid,
  Paper,
  Typography,
} from '@mui/material'

import { Breadcrumbs } from '@/common'
import { root } from '@/app/navigation/routes'

import { CardItem } from './ui'
import { useCardsModals } from './lib'
import { createDeckDetailController } from '../controllers'

export const DeckDetailPage = observer(() => {
  const { id: deckId } = useTypedParams(root.decks.detail)
  const { deckName } = useTypedState(root.decks.detail)
  const { t } = useTranslation(['common', 'cards', 'decks'])

  const controller = useLocalObservable(createDeckDetailController(deckId!))

  const breadcrumbItems = useMemo(() => ([
    {
      label: t('common:navigation.home'),
      icon: <HomeIcon fontSize="small" />,
      href: root.decks.$path(),
    },
    {
      label: deckName,
    },
  ]), [root, location, t])

  useCardsModals(controller)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container maxWidth="lg" sx={{ mt: 12, mb: 4 }}>
        <Breadcrumbs items={breadcrumbItems} onBackButtonClick={controller.goBackToDecks} />
        <Box display="flex" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" sx={{ flexGrow: 1 }}>
            {t('cards:deckDetail')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<PlayArrowIcon />}
            onClick={controller.startStudy(deckName)}
            disabled={controller.dueCardsCount === 0}
            sx={{ mr: 2 }}
          >
            {t('cards:studyAction')}
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="primary">
                {controller.totalCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:totalCards')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="warning.main">
                {controller.dueCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:dueToday')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="info.main">
                {controller.newCardsCount}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('cards:newCards')}
              </Typography>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h3" color="success.main">
                {controller.masteredCardsCount}
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
          {controller.totalCardsCount}
          )
        </Typography>

        {controller.isCardsLoading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}

        {!controller.isCardsLoading && controller.totalCardsCount === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
            {t('cards:noCards')}
          </Alert>
        )}

        {controller.cards && controller.cards.length > 0 && (
          <Box>
            {controller.cards.map(card => (
              <CardItem
                key={card.id}
                card={card}
                onEdit={() => { /* TODO: Implement edit functionality */ }}
                onDelete={controller.openDeleteModal(card.id)}
              />
            ))}
          </Box>
        )}
        <Fab
          color="primary"
          aria-label={t('cards:addCard')}
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={controller.openCreateModal}
        >
          <AddIcon />
        </Fab>
      </Container>
    </Box>
  )
})
