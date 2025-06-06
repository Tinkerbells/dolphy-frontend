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
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import type { Card as CardType } from '../../external'

interface CardItemProps {
  card: CardType
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
          <Typography variant="h6" component="div" gutterBottom>
            {card.question}
          </Typography>
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

        <Box display="flex" alignItems="center" gap={1}>
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
              mt: 1,
            }}
          >
            <Typography variant="body1">
              {card.answer}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}
