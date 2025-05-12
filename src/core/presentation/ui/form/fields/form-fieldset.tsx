import * as React from 'react'
import { Box, Typography } from '@mui/material'

export interface FormFieldsetProps {
  legend: string
  children: React.ReactNode
}

export function FormFieldset({ legend, children }: FormFieldsetProps) {
  return (
    <Box
      sx={{
        mb: 3,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 1,
        p: 2,
      }}
    >
      <Typography variant="subtitle1" component="legend" sx={{ mb: 2 }}>
        {legend}
      </Typography>

      {children}
    </Box>
  )
}
