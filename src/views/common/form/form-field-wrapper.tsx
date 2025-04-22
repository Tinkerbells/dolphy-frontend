import type { ReactNode } from 'react'

import { Box, FormHelperText, FormLabel, Stack, styled } from '@mui/material'

/**
 * Интерфейс свойств компонента FormFieldWrapper
 */
export interface FormFieldProps {
  /** Текст метки поля */
  label?: string
  /** Текст сообщения об ошибке */
  error?: string
  /** Дочерние элементы */
  children: ReactNode
  /** Обязательное поле */
  required?: boolean
  /** Дополнительные классы стилей */
  className?: string
}

/**
 * Стилизованная метка для обязательных полей
 */
const RequiredLabel = styled(FormLabel)(({ theme }) => ({
  '&::after': {
    content: '"*"',
    display: 'inline-block',
    marginLeft: theme.spacing(0.5),
    color: theme.palette.error.main,
  },
}))

/**
 * Компонент-обертка для полей формы
 * Отображает метку, поле ввода и сообщение об ошибке
 */
export function FormFieldWrapper({
  label,
  error,
  children,
  required = false,
  className,
}: FormFieldProps) {
  const LabelComponent = required ? RequiredLabel : FormLabel

  return (
    <Stack
      spacing={1}
      className={className}
      sx={{ mb: 2 }}
    >
      {label && (
        <LabelComponent>{label}</LabelComponent>
      )}

      <Box>
        {children}
      </Box>

      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Stack>
  )
}
