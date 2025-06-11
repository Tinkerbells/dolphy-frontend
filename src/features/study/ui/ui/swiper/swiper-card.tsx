import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, useTransform } from 'motion/react'
import {
  Box,
  Card,
  CardContent,
  Chip,
  styled,
  Typography,
} from '@mui/material'

import type { FsrsCardWithContent } from '@/features/fsrs/models'

import { useSwiperItem } from '@/common'
import { Rating } from '@/features/fsrs/models'

import styles from './swiper-card.module.css'

export interface SwiperStudyCardProps {
  cardData: FsrsCardWithContent
  active?: boolean
}

const StyledCard = styled(Card)(({ theme }) => ({
  'aspectRatio': '1/1',
  'position': 'absolute',
  'maxWidth': 400,
  'width': '100%',
  'backfaceVisibility': 'hidden',
  'WebkitBackfaceVisibility': 'hidden',
  'display': 'flex',
  'boxShadow': theme.shadows[8],
  'overflow': 'hidden',
  'borderRadius': theme.spacing(2),
  'cursor': 'pointer',
  '&:hover': {
    boxShadow: theme.shadows[12],
  },
}))

const StyledCardBack = styled(StyledCard)(() => ({
  transform: 'rotateY(180deg)',
}))

const CardContainer = styled(Box)(() => ({
  perspective: '1000px',
  height: '100%',
  width: '100%',
  position: 'relative',
}))

const RatingIndicator = styled(Box)<{ rating: Rating }>(({ theme, rating }) => {
  const colors = {
    [Rating.Again]: theme.palette.error.main,
    [Rating.Hard]: theme.palette.warning.main,
    [Rating.Good]: theme.palette.success.main,
    [Rating.Easy]: theme.palette.info.main,
    [Rating.Manual]: theme.palette.grey[500],
  }

  return {
    position: 'absolute',
    padding: theme.spacing(1, 2),
    borderRadius: theme.spacing(3),
    backgroundColor: colors[rating],
    color: theme.palette.common.white,
    fontWeight: 'bold',
    zIndex: 999,
  }
})

/**
 * Компонент карточки для swiper в активном состоянии
 */
function SwiperStudyCardActive({ cardData }: SwiperStudyCardProps) {
  const { t } = useTranslation(['cards'])
  const [isFlipped, setIsFlipped] = useState(false)
  const { x, y, offsetBoundary } = useSwiperItem()

  // Определяем направление и интенсивность свайпа
  const offsetX = useTransform(() =>
    Math.abs(x.get()) > Math.abs(y.get()) ? x.get() : 0,
  )

  const offsetY = useTransform(() =>
    Math.abs(y.get()) > Math.abs(x.get()) ? y.get() : 0,
  )

  // Определяем видимость индикаторов рейтинга
  const rightOpacity = useTransform(offsetX, [0, offsetBoundary], [0, 1])
  const leftOpacity = useTransform(offsetX, [-offsetBoundary, 0], [1, 0])
  const upOpacity = useTransform(offsetY, [-offsetBoundary, 0], [1, 0])
  const downOpacity = useTransform(offsetY, [0, offsetBoundary], [0, 1])

  const handleCardClick = () => {
    setIsFlipped(prev => !prev)
  }

  return (
    <>
      {/* Карточка */}
      <CardContainer>
        <motion.div
          whileTap={{ scale: 1.05, cursor: 'grabbing' }}
          onTap={handleCardClick}
          className={styles['flip-card-inner']}
          initial={false}
          transition={{ duration: 0.2, animationDirection: 'normal' }}
          animate={{ rotateY: isFlipped ? 180 : 360 }}
        >
          {/* Передняя сторона (вопрос) */}
          <StyledCard>
            <CardContent
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: 'background.paper',
                padding: 3,
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                }}
              >
                {cardData.card.question}
              </Typography>
            </CardContent>
          </StyledCard>

          {/* Задняя сторона (ответ) */}
          <StyledCardBack>
            <CardContent
              sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                padding: 3,
              }}
            >
              <Typography
                variant="h4"
                component="div"
                sx={{
                  wordBreak: 'break-word',
                  hyphens: 'auto',
                  color: 'inherit',
                }}
              >
                {cardData.card.answer}
              </Typography>
            </CardContent>
          </StyledCardBack>
        </motion.div>
      </CardContainer>
      {/* Индикаторы рейтинга */}
      <motion.div style={{ opacity: rightOpacity }}>
        <RatingIndicator
          rating={Rating.Good}
          sx={{
            right: 16,
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        >
          <Chip
            label={t('cards:rating.good')}
            color="success"
            variant="filled"
            size="medium"
          />
        </RatingIndicator>
      </motion.div>

      <motion.div style={{ opacity: leftOpacity }}>
        <RatingIndicator
          rating={Rating.Again}
          sx={{
            top: '50%',
            left: 16,
            transform: 'translateY(-50%)',
          }}
        >
          <Chip
            label={t('cards:rating.again')}
            color="error"
            variant="filled"
            size="medium"
          />
        </RatingIndicator>
      </motion.div>

      <motion.div style={{ opacity: upOpacity }}>
        <RatingIndicator
          rating={Rating.Easy}
          sx={{
            top: 16,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Chip
            label={t('cards:rating.easy')}
            color="info"
            variant="filled"
            size="medium"
          />
        </RatingIndicator>
      </motion.div>
      <motion.div style={{ opacity: downOpacity }}>
        <RatingIndicator
          rating={Rating.Hard}
          sx={{
            bottom: 16,
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          <Chip
            label={t('cards:rating.hard')}
            color="warning"
            variant="filled"
            size="medium"
          />
        </RatingIndicator>
      </motion.div>
    </>
  )
}

/**
 * Компонент карточки для swiper в неактивном состоянии
 */
function SwiperStudyCardInactive({ cardData }: SwiperStudyCardProps) {
  return (
    <CardContainer>
      <StyledCard sx={{ opacity: 0.1, transform: 'scale(0.95)' }}>
        <CardContent
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            bgcolor: 'background.paper',
            padding: 3,
          }}
        >
          <Typography
            variant="h5"
            component="div"
            sx={{
              wordBreak: 'break-word',
              hyphens: 'auto',
              opacity: 0.7,
            }}
          >
            {cardData.card.question}
          </Typography>
        </CardContent>
      </StyledCard>
    </CardContainer>
  )
}

/**
 * Основной компонент карточки для swiper
 */
export function SwiperStudyCard({ cardData, active }: SwiperStudyCardProps) {
  if (active) {
    return <SwiperStudyCardActive cardData={cardData} />
  }
  return <SwiperStudyCardInactive cardData={cardData} />
}
