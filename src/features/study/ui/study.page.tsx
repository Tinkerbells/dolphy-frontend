import { useTranslation } from 'react-i18next'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import CloseIcon from '@mui/icons-material/Close'
import { observer, useLocalObservable } from 'mobx-react-lite'
import { useTypedParams, useTypedState } from 'react-router-typesafe-routes'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Typography,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import { StudySwiper } from './ui'
import { createStudyController } from '../controllers/study.controller'

/**
 * Главная страница обучения с swiper
 */
export const StudyPage = observer(() => {
  const { id: deckId } = useTypedParams(root.decks.detail.study)
  const { deckName } = useTypedState(root.decks.detail.study)
  const { t } = useTranslation(['cards', 'common'])

  const controller = useLocalObservable(createStudyController(deckId!))

  if (controller.isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!controller.dueCards || controller.dueCards.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 12 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {t('cards:study.sessionComplete')}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={controller.finishSession(deckName)}
          >
            {t('cards:study.backToDeck')}
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={theme => ({ mb: 4, mt: `${theme.mixins.toolbar.minHeight}px`, pt: 4, height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`, overflow: 'hidden' })}>
      {/* Заголовок и управление */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          {deckName}
        </Typography>

        <Box display="flex" gap={1}>
          <IconButton
            onClick={controller.undoLastGrade}
            disabled={!controller.canUndo}
            title={t('common:actions.undo')}
            size="small"
          >
            <UndoIcon />
          </IconButton>

          <IconButton
            onClick={controller.redoLastGrade}
            disabled={!controller.canRedo}
            title={t('common:actions.redo')}
            size="small"
          >
            <RedoIcon />
          </IconButton>

          <IconButton
            onClick={controller.finishSession(deckName)}
            aria-label={t('common:actions.close')}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Прогресс бар */}
      <Box mb={3}>
        <LinearProgress
          variant="determinate"
          value={controller.progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      <StudySwiper
        cards={controller.dueCards}
        currentIndex={0}
        isProcessing={controller.isGrading}
        handleSwipe={controller.handleSwipe}
      />
    </Container>
  )
})
