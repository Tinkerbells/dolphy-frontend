import React from 'react'
import { Button, Group, Stack, TextInput } from '@mantine/core'

interface CardFormViewProps {
  front: string
  back: string
  loading: boolean
  onFrontChange: (value: string) => void
  onBackChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export const CardFormView: React.FC<CardFormViewProps> = ({
  front,
  back,
  loading,
  onFrontChange,
  onBackChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Stack>
      <TextInput
        label="Front"
        placeholder="Enter front side text"
        value={front}
        onChange={e => onFrontChange(e.target.value)}
        required
      />

      <TextInput
        label="Back"
        placeholder="Enter back side text"
        value={back}
        onChange={e => onBackChange(e.target.value)}
        required
      />

      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={onSubmit}
          disabled={!front.trim() || !back.trim() || loading}
          loading={loading}
        >
          Create
        </Button>
      </Group>
    </Stack>
  )
}
