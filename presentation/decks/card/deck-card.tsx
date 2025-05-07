import { useState } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import SchoolIcon from '@mui/icons-material/School'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'

import type { Deck } from '@/domain'

interface DeckCardProps {
  deck: Deck
  onEdit: (deck: Deck) => void
  onDelete: (deck: Deck) => void
  onStudy: (deckId: string) => void
}

/**
 * Компонент карточки колоды
 */
export const DeckCard: React.FC<DeckCardProps> = ({
  deck,
  onEdit,
  onDelete,
  onStudy,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    onEdit(deck)
    handleClose()
  }

  const handleDelete = () => {
    onDelete(deck)
    handleClose()
  }

  const handleStudy = () => {
    onStudy(deck.id)
  }

  // Форматирование даты создания
  const formattedDate = new Date(deck.createdAt).toLocaleDateString()

  return (
    <Card
      sx={{
        'height': '100%',
        'display': 'flex',
        'flexDirection': 'column',
        'transition': 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Typography variant="h6" component="div" noWrap gutterBottom>
            {deck.name}
          </Typography>
          <IconButton
            aria-label="меню"
            size="small"
            onClick={handleClick}
            aria-controls={open ? 'deck-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="deck-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'deck-menu-button',
            }}
          >
            <MenuItem onClick={handleEdit}>
              <EditIcon fontSize="small" sx={{ mr: 1 }} />
              Редактировать
            </MenuItem>
            <MenuItem onClick={handleDelete}>
              <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
              Удалить
            </MenuItem>
          </Menu>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            minHeight: '4.5em',
          }}
        >
          {deck.description || 'Нет описания'}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          Создана:
          {' '}
          {formattedDate}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          startIcon={<SchoolIcon />}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleStudy}
        >
          Учить
        </Button>
      </CardActions>
    </Card>
  )
}
