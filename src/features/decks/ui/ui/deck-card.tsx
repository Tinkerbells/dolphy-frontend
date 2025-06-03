import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import {
  Box,
  Card,
  CardContent,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from '@mui/material'

import { root } from '@/app/navigation/routes'

import type { Deck } from '../../models/deck.domain'

interface DeckCardProps {
  deck: Deck
  onEdit: () => void
  onDelete: () => void
}

export function DeckCard({ deck, onEdit, onDelete }: DeckCardProps) {
  const { t } = useTranslation(['decks', 'common'])
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault()
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
    <Link underline="none" href={root.decks.detail.$buildPath({ params: { id: deck.id } })}>
      <Card
        elevation={2}
        sx={{
          'height': '100%',
          'display': 'flex',
          'cursor': 'pointer',
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
            <Typography
              variant="h6"
              component="h2"
              gutterBottom
            >
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
              onClick={e => e.stopPropagation()}
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
                {/* Add your cards count here */}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('decks:dueCount')}
                :
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {/* Add your due count here */}
              </Typography>
            </Box>

            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                {t('decks:lastStudied')}
                :
              </Typography>
              <Typography variant="body2" fontWeight="medium">
                {/* Add your last studied date here */}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  )
}
