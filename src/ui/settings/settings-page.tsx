import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Container,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core'

import type { StudyPreferences } from '../../domain/user'

import { useStore } from '../../services/store'
import { useTelegram } from '../../services/telegram-adapter'
import { useNotifier } from '../../services/notification-adapter'
import { DEFAULT_PREFERENCES, updateUserPreferences } from '../../domain/user'
import { useDecksStorage, useUserStorage } from '../../services/storage-adapter'

// Reset confirmation modal
const ResetConfirmationModal: React.FC<{
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}> = ({ opened, onClose, onConfirm }) => {
  return (
    <Modal opened={opened} onClose={onClose} title="Reset Application Data">
      <Stack>
        <Text>
          Warning: This will delete all your decks, cards, and settings. This action cannot be undone.
        </Text>

        <Group justify="flex-end" mt="md">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button color="red" onClick={onConfirm}>Reset Everything</Button>
        </Group>
      </Stack>
    </Modal>
  )
}

// Settings page component
export const SettingsPage: React.FC = observer(() => {
  const navigate = useNavigate()
  const telegram = useTelegram()
  const notifier = useNotifier()
  const { user, updateUser } = useUserStorage()
  const { decks } = useDecksStorage()
  const store = useStore()

  // Reset confirmation modal
  const [resetModalOpened, resetModal] = useDisclosure(false)

  // Settings state
  const [preferences, setPreferences] = useState<StudyPreferences>(
    user?.preferences || DEFAULT_PREFERENCES,
  )

  // Set page title and back button
  useEffect(() => {
    telegram.showBackButton(true)
    const cleanup = telegram.onBackButtonClick(() => {
      navigate('/')
    })
    return cleanup
  }, [telegram, navigate])

  // Update state when user changes
  useEffect(() => {
    if (user?.preferences) {
      setPreferences(user.preferences)
    }
  }, [user])

  // Handle save settings
  const handleSaveSettings = () => {
    if (!user)
      return

    const updatedUser = updateUserPreferences(user, preferences)
    updateUser(updatedUser)
    notifier.notify('Settings saved successfully')
  }

  // Handle reset application
  const handleResetApp = () => {
    store.resetStore()
    notifier.notify('Application data has been reset')
    navigate('/')
  }

  if (!user)
    return null

  // Generate deck options for default deck selection
  const deckOptions = [
    { value: '', label: 'None' },
    ...decks.map(deck => ({
      value: deck.id,
      label: deck.title,
    })),
  ]

  return (
    <Container p="md">
      <Stack gap="lg">
        <Title order={3}>Settings</Title>

        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack>
            <Title order={5}>Study Preferences</Title>

            <NumberInput
              label="New Cards Per Day"
              description="Maximum number of new cards to show per day"
              min={1}
              max={100}
              value={preferences.newCardsPerDay}
              onChange={value => setPreferences({
                ...preferences,
                newCardsPerDay: Number(value),
              })}
            />

            <NumberInput
              label="Reviews Per Day"
              description="Maximum number of review cards to show per day"
              min={1}
              max={500}
              value={preferences.reviewsPerDay}
              onChange={value => setPreferences({
                ...preferences,
                reviewsPerDay: Number(value),
              })}
            />

            <Select
              label="Default Deck"
              description="Deck to open when you start the app"
              data={deckOptions}
              value={preferences.defaultDeckId || ''}
              onChange={value => setPreferences({
                ...preferences,
                defaultDeckId: value || undefined,
              })}
              searchable
              clearable
            />
          </Stack>
        </Card>

        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack>
            <Title order={5}>Display Preferences</Title>

            <Switch
              label="Show Remaining Cards"
              description="Show the number of remaining cards during study"
              checked={preferences.showRemainingCards}
              onChange={event => setPreferences({
                ...preferences,
                showRemainingCards: event.currentTarget.checked,
              })}
            />

            <Switch
              label="Show Timer"
              description="Show a timer during study sessions"
              checked={preferences.showTimer}
              onChange={event => setPreferences({
                ...preferences,
                showTimer: event.currentTarget.checked,
              })}
            />

            <Switch
              label="Dark Mode"
              description="Use dark mode theme"
              checked={preferences.darkMode}
              onChange={event => setPreferences({
                ...preferences,
                darkMode: event.currentTarget.checked,
              })}
            />
          </Stack>
        </Card>

        <Card shadow="sm" p="md" radius="md" withBorder>
          <Stack>
            <Title order={5}>Data Management</Title>

            <Text size="sm" c="dimmed">
              You can reset all application data if needed. This will delete all your decks,
              cards, study history, and preferences.
            </Text>

            <Button
              variant="outline"
              color="red"
              onClick={resetModal.open}
            >
              Reset All Data
            </Button>
          </Stack>
        </Card>

        <Group justify="space-between">
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Decks
          </Button>

          <Button onClick={handleSaveSettings}>
            Save Settings
          </Button>
        </Group>
      </Stack>

      <ResetConfirmationModal
        opened={resetModalOpened}
        onClose={resetModal.close}
        onConfirm={handleResetApp}
      />
    </Container>
  )
})
