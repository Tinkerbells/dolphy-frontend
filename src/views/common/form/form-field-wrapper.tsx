import type { ReactNode } from 'react'

import { Box, FormHelperText, Stack } from '@mui/material'

/**
 * Интерфейс свойств компонента FormFieldWrapper
 */
export interface FormFieldProps {
  /** Текст сообщения об ошибке */
  error?: string
  /** Дочерние элементы */
  children: ReactNode
  /** Дополнительные классы стилей */
  className?: string
}

/**
 * Компонент-обертка для полей формы
 * Отображает метку, поле ввода и сообщение об ошибке
 */
export function FormFieldWrapper({
  error,
  children,
  className,
}: FormFieldProps) {
  return (
    <Stack
      spacing={1}
      className={className}
      sx={{ mb: 2 }}
    >
      <Box>
        {children}
      </Box>
      {error && (
        <FormHelperText error>{error}</FormHelperText>
      )}
    </Stack>
  )
}
