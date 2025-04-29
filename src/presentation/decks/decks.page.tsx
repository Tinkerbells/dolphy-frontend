import { useState } from 'react'
import { useNavigate } from 'react-router'
import AddIcon from '@mui/icons-material/Add'
import { useTheme } from '@mui/material/styles'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Divider,
  Fab,
  Grid,
  Paper,
  Typography,
  useMediaQuery,
} from '@mui/material'

import type { CreateDeckDto, Deck, UpdateDeckDto } from '@/domain'

import { Symbols } from '@/di'
import { useService } from '@/di/provider'
import { root } from '@/presentation/core/react-router'

import type { DecksStore } from './decks.store'

import { DeckCard } from './card/deck-card'
import { DeckDialog } from './dialog/create-deck-dialog'
import { DeleteDeckDialog } from './dialog/delete-deck-dialog'

/**
 * Страница колод пользователя
 */
export function DecksPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const store = useService<DecksStore>(Symbols.DecksStore)

  // Респонсивность для мобильных устройств
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  // Состояния для диалогов
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null)

  // Обработчики диалогов
  const handleOpenCreateDialog = () => {
    setSelectedDeck(null)
    setCreateDialogOpen(true)
  }

  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false)
  }

  const handleOpenEditDialog = (deck: Deck) => {
    setSelectedDeck(deck)
    setEditDialogOpen(true)
  }

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false)
  }

  const handleOpenDeleteDialog = (deck: Deck) => {
    setSelectedDeck(deck)
    setDeleteDialogOpen(true)
  }

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
  }

  // Обработчики действий с колодами
  const handleCreateDeck = async (data: CreateDeckDto) => {
    await store.createDeck.mutate(data)
    handleCloseCreateDialog()
  }

  const handleUpdateDeck = async (data: UpdateDeckDto) => {
    if (selectedDeck) {
      await store.updateDeck.mutate({ id: selectedDeck.id, data })
      handleCloseEditDialog()
    }
  }

  const handleDeleteDeck = async () => {
    if (selectedDeck) {
      await store.deleteDeck.mutate(selectedDeck.id)
      handleCloseDeleteDialog()
    }
  }

  const handleStudyDeck = (deckId: string) => {
    navigate(`${root.decks.$path()}/${deckId}`)
  }

  const { data: decks, isLoading, isError, error } = store.decks.result

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Мои колоды
        </Typography>

        {/* Скрываем кнопку на мобильных устройствах, там используется FAB */}
        {!isMobile && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleOpenCreateDialog}
          >
            Создать колоду
          </Button>
        )}
      </Box>

      <Divider sx={{ mb: 3 }} />

      {isLoading
        ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh',
              }}
            >
              <CircularProgress />
            </Box>
          )
        : isError
          ? (
              <Paper
                sx={{
                  p: 3,
                  bgcolor: 'error.light',
                  color: 'error.contrastText',
                }}
              >
                <Typography variant="h6">Ошибка загрузки колод</Typography>
                <Typography variant="body2">{error?.message || 'Неизвестная ошибка'}</Typography>
              </Paper>
            )
          : decks && decks.data.length > 0
            ? (
                <Grid container spacing={3}>
                  {decks.data.map(deck => (
                    <Grid key={deck.id}>
                      <DeckCard
                        deck={deck}
                        onEdit={handleOpenEditDialog}
                        onDelete={handleOpenDeleteDialog}
                        onStudy={handleStudyDeck}
                      />
                    </Grid>
                  ))}
                </Grid>
              )
            : (
                <Paper
                  sx={{
                    p: 5,
                    textAlign: 'center',
                    bgcolor: 'background.default',
                  }}
                >
                  <Typography variant="h6" gutterBottom>
                    У вас ещё нет колод
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    Создайте свою первую колоду, чтобы начать обучение
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateDialog}
                  >
                    Создать колоду
                  </Button>
                </Paper>
              )}

      {/* Плавающая кнопка для создания колоды на мобильных устройствах */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenCreateDialog}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Диалоги */}
      <DeckDialog
        open={createDialogOpen}
        onClose={handleCloseCreateDialog}
        onSubmit={handleCreateDeck}
        isSubmitting={store.createDeck.result.isPending}
      />

      <DeckDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        onSubmit={handleUpdateDeck}
        deck={selectedDeck || undefined}
        isSubmitting={store.updateDeck.result.isPending}
      />

      <DeleteDeckDialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        onConfirm={handleDeleteDeck}
        deckName={selectedDeck?.name || ''}
        isSubmitting={store.deleteDeck.result.isPending}
      />
    </Container>
  )
}
