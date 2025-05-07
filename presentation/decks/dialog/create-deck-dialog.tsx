import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { classValidatorResolver } from '@hookform/resolvers/class-validator'
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material'

import type { Deck } from '@/domain'

import { CreateDeckDto } from '@/domain'

interface DeckDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: CreateDeckDto) => void
  deck?: Deck
  isSubmitting: boolean
}

/**
 * Диалог создания/редактирования колоды
 */
export const DeckDialog: React.FC<DeckDialogProps> = ({
  open,
  onClose,
  onSubmit,
  deck,
  isSubmitting,
}) => {
  const isEditMode = !!deck

  // Инициализация формы с валидацией
  const { control, handleSubmit, reset, formState: { errors, isValid } } = useForm<CreateDeckDto>({
    resolver: classValidatorResolver(CreateDeckDto),
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  })

  // Сброс формы при открытии диалога или изменении колоды
  useEffect(() => {
    if (open) {
      reset({
        name: deck?.name || '',
        description: deck?.description || '',
      })
    }
  }, [open, deck, reset])

  // Обработчик отправки формы
  const onFormSubmit = (data: CreateDeckDto) => {
    onSubmit(data)
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="deck-dialog-title"
    >
      <DialogTitle id="deck-dialog-title">
        {isEditMode ? 'Редактировать колоду' : 'Создать колоду'}
      </DialogTitle>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Название колоды"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  autoFocus
                  required
                  inputProps={{ maxLength: 100 }}
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Описание"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={4}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  inputProps={{ maxLength: 500 }}
                />
              )}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} color="inherit">
            Отмена
          </Button>
          <Button
            type="submit"
            color="primary"
            variant="contained"
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? 'Сохранение...' : (isEditMode ? 'Сохранить' : 'Создать')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
