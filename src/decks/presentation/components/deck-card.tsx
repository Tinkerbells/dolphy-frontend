import { useState } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router'
import { enUS, ru } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import type { Deck } from '@/decks/domain'

import { root } from '@/core/presentation/navigation/routes'

interface DeckCardProps {
  deck: Deck
  onEdit: () => void
  onDelete: () => void
}

export function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
  const { t, i18n } = useTranslation(['decks', 'common'])
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  // Для получения локали для форматирования даты
  const dateLocale = i18n.language === 'ru' ? ru : enUS

  // Форматирование даты последнего изучения
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, 'PPP', { locale: dateLocale })
    }
    catch (e) {
      return t('common:unknown')
    }
  }

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

  const handleStudy = () => {
    navigate(root.decks.detail.$path({ id: deck.id }))
  }

  // Заглушки для тестовых данных
  const cardsCount = 25
  const dueCount = 7
  const lastStudied = deck.updatedAt || deck.createdAt

  return (
    <Card
      elevation={2}
      sx={{
        'height': '100%',
        'display': 'flex',
        'flexDirection': 'column',
        'transition': 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="h2" gutterBottom>
            {deck.name}
          </Typography>

          <Tooltip title={t('decks:moreOptions')}>
            <IconButton
              size="small"
              onClick={handleOpenMenu}
              aria-label={t('decks:moreOptions')}
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
              {t('decks:edit')}
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              {t('decks:delete')}
            </MenuItem>
          </Menu>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            height: 60,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {deck.description || t('decks:noDescription')}
        </Typography>

        <Box display="flex" flexDirection="column" gap={1}>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {t('decks:cardsCount')}
              :
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {cardsCount}
            </Typography>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {t('decks:dueCount')}
              :
            </Typography>
            <Chip
              label={dueCount}
              size="small"
              color={dueCount > 0 ? 'primary' : 'default'}
              sx={{ minWidth: 50 }}
            />
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">
              {t('decks:lastStudied')}
              :
            </Typography>
            <Typography variant="body2" fontWeight="medium">
              {formatDate(lastStudied)}
            </Typography>
          </Box>
        </Box>
      </CardContent>

      <CardActions>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStudy}
          disabled={cardsCount === 0}
        >
          {dueCount > 0
            ? t('decks:studyNow', { count: dueCount })
            : t('decks:browse')}
        </Button>
      </CardActions>
    </Card>
  )
}
