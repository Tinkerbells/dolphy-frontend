import React from 'react'
import { Button, Group, Stack, TextInput } from '@mantine/core'

interface DeckFormViewProps {
  title: string
  description: string
  loading: boolean
  onTitleChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: () => void
  onCancel: () => void
}

export const DeckFormView: React.FC<DeckFormViewProps> = ({
  title,
  description,
  loading,
  onTitleChange,
  onDescriptionChange,
  onSubmit,
  onCancel,
}) => {
  return (
    <Stack justify="center">
      <TextInput
        label="Deck Title"
        placeholder="Enter deck title"
        value={title}
        onChange={e => onTitleChange(e.target.value)}
        required
      />

      <TextInput
        label="Description"
        placeholder="Enter deck description (optional)"
        value={description}
        onChange={e => onDescriptionChange(e.target.value)}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button
          onClick={onSubmit}
          disabled={!title.trim() || loading}
          loading={loading}
        >
          Create
        </Button>
      </Group>
    </Stack>
  )
}
