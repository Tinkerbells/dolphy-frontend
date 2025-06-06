import React from 'react'
import { useTranslation } from 'react-i18next'
import CloseIcon from '@mui/icons-material/Close'
import { useTypedParams } from 'react-router-typesafe-routes'
import { observer, useLocalObservable } from 'mobx-react-lite'
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  IconButton,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import { StudyCard } from './ui'
import { Rating } from '../external'
import { createStudyController } from '../controllers/study.controller'

/**
 * Кнопки для оценки карточки
 */
const RatingButtons = observer(({
  onRate,
  disabled,
}: {
  onRate: (rating: Rating) => void
  disabled: boolean
}) => {
  const { t } = useTranslation(['cards'])

  const ratingOptions = [
    {
      rating: Rating.Again,
      label: t('cards:rating.again'),
      color: 'error' as const,
      shortcut: '1',
    },
    {
      rating: Rating.Hard,
      label: t('cards:rating.hard'),
      color: 'warning' as const,
      shortcut: '2',
    },
    {
      rating: Rating.Good,
      label: t('cards:rating.good'),
      color: 'success' as const,
      shortcut: '3',
    },
    {
      rating: Rating.Easy,
      label: t('cards:rating.easy'),
      color: 'info' as const,
      shortcut: '4',
    },
  ]

  return (
    <Stack direction="row" spacing={2} justifyContent="center">
      {ratingOptions.map(({ rating, label, color, shortcut }) => (
        <Button
          key={rating}
          variant="contained"
          color={color}
          size="large"
          disabled={disabled}
          onClick={() => onRate(rating)}
          sx={{
            minWidth: 120,
            position: 'relative',
          }}
        >
          {label}
          <Typography
            variant="caption"
            sx={{
              position: 'absolute',
              top: 4,
              right: 8,
              fontSize: '0.7rem',
              opacity: 0.7,
            }}
          >
            {shortcut}
          </Typography>
        </Button>
      ))}
    </Stack>
  )
})

/**
 * Главная страница обучения
 */
export const StudyPage = observer(() => {
  const { id: deckId } = useTypedParams(root.decks.detail.study)
  const { t } = useTranslation(['cards', 'common'])

  const controller = useLocalObservable(createStudyController(deckId!))

  // Обработка горячих клавиш
  React.useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!controller.currentCard || !controller.isCardFlipped) {
        return
      }

      switch (event.key) {
        case '1':
          controller.gradeCard(Rating.Again)
          break
        case '2':
          controller.gradeCard(Rating.Hard)
          break
        case '3':
          controller.gradeCard(Rating.Good)
          break
        case '4':
          controller.gradeCard(Rating.Easy)
          break
        case ' ':
        case 'Enter':
          if (!controller.isCardFlipped) {
            controller.flipCard()
          }
          break
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [controller])

  if (controller.isLoading) {
    return (
      <Container maxWidth="md" sx={{ mt: 12, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    )
  }

  if (!controller.currentCard || controller.isSessionComplete) {
    return (
      <Container maxWidth="md" sx={{ mt: 12 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            {t('cards:study.sessionComplete')}
          </Typography>

          <Box sx={{ my: 3 }}>
            <Typography variant="h6" color="text.secondary">
              {t('cards:study.accuracy')}
              :
              {
                Math.round((controller.sessionStats.correct / Math.max(controller.sessionStats.total, 1)) * 100)
              }
              %
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {t('cards:study.totalCards')}
              :
              {controller.sessionStats.total}
            </Typography>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={controller.finishSession}
          >
            {t('cards:study.backToDeck')}
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* Заголовок и кнопка закрытия */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h1">
          {t('cards:study.title')}
        </Typography>

        <IconButton
          onClick={controller.finishSession}
          aria-label={t('common:actions.close')}
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Прогресс бар */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="body2" color="text.secondary">
            {t('cards:study.progress')}
            :
            {controller.progress}
            %
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('cards:study.remaining')}
            :
            {controller.remainingCards}
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={controller.progress}
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Статистика сессии */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" justifyContent="space-around">
          <Box textAlign="center">
            <Typography variant="h6" color="success.main">
              {controller.sessionStats.correct}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('cards:study.correct')}
            </Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="h6" color="error.main">
              {controller.sessionStats.incorrect}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('cards:study.incorrect')}
            </Typography>
          </Box>

          <Box textAlign="center">
            <Typography variant="h6" color="primary.main">
              {controller.sessionStats.total}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('cards:study.total')}
            </Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Карточка для изучения */}
      <StudyCard
        question={controller.currentCard.card.question}
        answer={controller.currentCard.card.answer}
        isFlipped={controller.isCardFlipped}
        onFlip={controller.flipCard}
      />

      {/* Подсказка для переворота карточки */}
      {!controller.isCardFlipped && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {t('cards:study.clickToReveal')}
        </Alert>
      )}

      {controller.isCardFlipped && (
        <RatingButtons
          onRate={controller.gradeCard}
          disabled={controller.isGrading || controller.isLoading}
        />
      )}

      {controller.isGrading && (
        <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
          <CircularProgress size={24} sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {t('cards:study.grading')}
          </Typography>
        </Box>
      )}

      {/* Подсказки по горячим клавишам */}
      {controller.isCardFlipped && (
        <Box mt={2}>
          <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
            {t('cards:study.keyboardShortcuts')}
          </Typography>
        </Box>
      )}
    </Container>
  )
})
