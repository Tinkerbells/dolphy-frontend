import type { DividerProps } from '@mui/material'

import { Divider, Typography } from '@mui/material'

/**
 * Интерфейс свойств компонента FormDivider
 */
export type FormDividerProps = DividerProps & {
  /** Текст разделителя */
  text?: string
}

/**
 * Компонент разделителя формы
 * Использует Material UI Divider
 */
export function FormDivider({
  text,
  textAlign = 'left',
  ...props
}: FormDividerProps) {
  if (text) {
    return (
      <Divider
        textAlign={textAlign}
        sx={{ my: 3 }}
        {...props}
      >
        <Typography
          variant="subtitle1"
          color="text.secondary"
        >
          {text}
        </Typography>
      </Divider>
    )
  }

  return <Divider sx={{ my: 3 }} {...props} />
}
