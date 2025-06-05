import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import type { FsrsCardWithContent } from '../../external'

interface CardItemProps {
  card: FsrsCardWithContent
  onEdit: () => void
  onDelete: () => void
}

export function CardItem({ card, onEdit, onDelete }: CardItemProps) {
  const { t } = useTranslation(['cards', 'common'])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [showAnswer, setShowAnswer] = useState(false)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    handleCloseMenu()
    onEdit()
  }

  const handleDelete = () => {
    handleCloseMenu()
    onDelete()
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'New':
        return 'primary'
      case 'Learning':
        return 'warning'
      case 'Review':
        return 'success'
      case 'Relearning':
        return 'error'
      default:
        return 'default'
    }
  }

  return (
    <Card
      elevation={1}
      sx={{
        'mb': 2,
        'transition': 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-1px)',
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box display="flex" gap={1} alignItems="center">
            <Chip
              label={t(`cards:state.${card.state}`)}
              size="small"
              color={getStateColor(card.state)}
              variant="outlined"
            />
            {card.reps > 0 && (
              <Chip
                label={t('cards:repetitionsCount', { count: card.reps })}
                size="small"
                variant="outlined"
              />
            )}
          </Box>

          <Tooltip title={t('cards:moreOptions')}>
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              aria-label={t('cards:moreOptions')}
            >
              <MoreVertIcon />
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              {t('cards:edit')}
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              {t('cards:delete')}
            </MenuItem>
          </Menu>
        </Box>

        <Typography variant="h6" component="div" gutterBottom>
          {card.card.question}
        </Typography>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <IconButton
            size="small"
            onClick={() => setShowAnswer(!showAnswer)}
            aria-label={showAnswer ? t('cards:hideAnswer') : t('cards:showAnswer')}
          >
            {showAnswer ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {showAnswer ? t('cards:hideAnswer') : t('cards:showAnswer')}
          </Typography>
        </Box>

        {showAnswer && (
          <Box
            sx={{
              p: 2,
              backgroundColor: 'action.hover',
              borderRadius: 1,
              mb: 2,
            }}
          >
            <Typography variant="body1">
              {card.card.answer}
            </Typography>
          </Box>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {t('cards:nextReview')}
            {': '}
            {/* {formatDate(card.due)} */}
          </Typography>

          {card.last_review && (
            <Typography variant="body2" color="text.secondary">
              {t('cards:lastReview')}
              {': '}
              {/* {formatDate(card.last_review)} */}
            </Typography>
          )}
        </Box>

        {/* {card.note.extend?.tags && ( */}
        {/*   <Box mt={1} display="flex" gap={0.5} flexWrap="wrap"> */}
        {/*     {card.note.extend.tags.map((tag: string, index: number) => ( */}
        {/*       <Chip */}
        {/*         key={index} */}
        {/*         label={tag} */}
        {/*         size="small" */}
        {/*         variant="outlined" */}
        {/*         color="secondary" */}
        {/*       /> */}
        {/*     ))} */}
        {/*   </Box> */}
        {/* )} */}
      </CardContent>
    </Card>
  )
}
