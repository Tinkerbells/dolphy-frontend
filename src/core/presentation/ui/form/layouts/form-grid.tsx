import * as React from 'react'
import { Grid } from '@mui/material'

export interface FormGridProps {
  children: React.ReactNode
  columns?: number
}

export function FormGrid({ children }: FormGridProps) {
  const childrenArray = React.Children.toArray(children)

  return (
    <Grid container spacing={2} sx={{ mb: 2 }}>
      {childrenArray.map((child, index) => (
        <Grid key={`grid-item-${index}`}>
          {child}
        </Grid>
      ))}
    </Grid>
  )
}
