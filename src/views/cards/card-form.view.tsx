// src/views/cards/card-form.view.tsx

import React from 'react'
import { Button, Group, MultiSelect, Stack, Textarea, TextInput } from '@mantine/core'

interface CardFormViewProps {
  front: string
  back: string
  tags: string[]
  availableTags: string[]
  loading: boolean
  onFrontChange: (value: string) => void
  onBackChange: (value: string) => void
  onTagsChange: (value: string[]) => void
  onSubmit: () => void
  onCancel: () => void
  isEdit?: boolean
}

export const CardFormView: React.FC<CardFormViewProps> = ({
  front,
  back,
  tags,
  availableTags,
  loading,
  onFrontChange,
  onBackChange,
  onTagsChange,
  onSubmit,
  onCancel,
  isEdit = false,
}) => {
  const handleCreateTag = (query: string) => {
    const tag = query.trim().toLowerCase()
    onTagsChange([...tags, tag])
    return tag
  }

  return (
    <Stack>
      <Textarea
        label="Front (Question)"
        placeholder="Enter the question or prompt"
        value={front}
        onChange={e => onFrontChange(e.target.value)}
        minRows={3}
        required
        autosize
      />

      <Textarea
        label="Back (Answer)"
        placeholder="Enter the answer"
        value={back}
        onChange={e => onBackChange(e.target.value)}
        minRows={3}
        required
        autosize
      />

      <MultiSelect
        label="Tags"
        placeholder="Select or create tags"
        data={availableTags}
        value={tags}
        onChange={onTagsChange}
        searchable
        creatable
        getCreateLabel={query => `+ Create ${query}`}
        onCreate={handleCreateTag}
      />

      <Group justify="flex-end" mt="md">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>

        <Button
          onClick={onSubmit}
          disabled={!front.trim() || !back.trim() || loading}
          loading={loading}
        >
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Group>
    </Stack>
  )
}
