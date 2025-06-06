import { observer } from 'mobx-react-lite'
import { Box, Card, CardContent, Typography } from '@mui/material'

export interface StudyCardProps {
  question: string
  answer: string
  isFlipped: boolean
  onFlip: () => void
}
/**
 * Компонент карточки для обучения с анимацией переворота
 */
export const StudyCard = observer(({
  question,
  answer,
  isFlipped,
  onFlip,
}: StudyCardProps) => {
  return (
    <Box
      sx={{
        perspective: '1000px',
        width: '100%',
        height: 400,
        mb: 4,
      }}
    >
      <Box
        onClick={onFlip}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          cursor: 'pointer',
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s ease-in-out',
        }}
      >
        {/* Передняя сторона (вопрос) */}
        <Card
          sx={theme => ({
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'backfaceVisibility': 'hidden',
            'WebkitBackfaceVisibility': 'hidden',
            'display': 'flex',
            'boxShadow': theme.shadows[8],
            'overflow': 'hidden',
            '&:hover': {
              boxShadow: theme.shadows[12],
            },
          })}
        >
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
              {question}
            </Typography>
          </CardContent>
        </Card>

        {/* Задняя сторона (ответ) */}
        <Card
          sx={theme => ({
            'position': 'absolute',
            'width': '100%',
            'height': '100%',
            'backfaceVisibility': 'hidden',
            'WebkitBackfaceVisibility': 'hidden',
            'transform': 'rotateY(180deg)',
            'display': 'flex',
            'boxShadow': theme.shadows[8],
            'overflow': 'hidden',
            '&:hover': {
              boxShadow: theme.shadows[12],
            },
          })}
        >
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
              {answer}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
})
