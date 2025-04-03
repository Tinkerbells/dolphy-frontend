// src/views/stats/study-stats-view.tsx

import React from 'react'
import { Activity, BookOpen, Calendar, CheckCircle2, Clock } from 'lucide-react'
import { Card, Grid, Group, RingProgress, Stack, Text, ThemeIcon } from '@mantine/core'

import type { StudyStats } from '@/models/study-session'

interface StudyStatsViewProps {
  stats: StudyStats
}

export const StudyStatsView: React.FC<StudyStatsViewProps> = ({ stats }) => {
  // Форматирование времени обучения
  const formatStudyTime = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} minutes`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`
    }

    return `${hours} hour${hours !== 1 ? 's' : ''} ${remainingMinutes} minute${remainingMinutes !== 1 ? 's' : ''}`
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Grid gutter="xl">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack align="center">
            <RingProgress
              size={180}
              thickness={16}
              roundCaps
              sections={[
                { value: stats.averageCorrectRate * 100, color: 'blue' },
              ]}
              label={(
                <Text ta="center">
                  <Text size="xl" fw={700}>
                    {(stats.averageCorrectRate * 100).toFixed(1)}
                    %
                  </Text>
                  <Text size="sm">Correct Rate</Text>
                </Text>
              )}
            />

            <Group>
              <ThemeIcon size="md" radius="xl" color="green">
                <CheckCircle2 size={20} />
              </ThemeIcon>
              <Text fw={500}>
                Streak:
                {' '}
                {stats.streakDays}
                {' '}
                day
                {stats.streakDays !== 1 ? 's' : ''}
              </Text>
            </Group>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            <Text size="xl" fw={700} mb="md">Study Summary</Text>

            <Grid>
              <Grid.Col span={6}>
                <StatItem
                  icon={<BookOpen size={20} />}
                  color="blue"
                  label="Total Cards Studied"
                  value={stats.totalCards.toString()}
                />
              </Grid.Col>

              <Grid.Col span={6}>
                <StatItem
                  icon={<Clock size={20} />}
                  color="grape"
                  label="Time Studied"
                  value={formatStudyTime(stats.totalTimeStudied)}
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <StatItem
                  icon={<Activity size={20} />}
                  color="orange"
                  label="New Cards"
                  value={stats.newCards.toString()}
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <StatItem
                  icon={<Activity size={20} />}
                  color="green"
                  label="Learning Cards"
                  value={stats.learningCards.toString()}
                />
              </Grid.Col>

              <Grid.Col span={4}>
                <StatItem
                  icon={<Activity size={20} />}
                  color="blue"
                  label="Review Cards"
                  value={stats.reviewCards.toString()}
                />
              </Grid.Col>
            </Grid>
          </Stack>
        </Grid.Col>
      </Grid>
    </Card>
  )
}

// Вспомогательный компонент для элемента статистики
interface StatItemProps {
  icon: React.ReactNode
  color: string
  label: string
  value: string
}

const StatItem: React.FC<StatItemProps> = ({ icon, color, label, value }) => (
  <Group noWrap>
    <ThemeIcon size="lg" radius="xl" color={color}>
      {icon}
    </ThemeIcon>
    <Stack spacing={0}>
      <Text fw={700}>{value}</Text>
      <Text size="sm" c="dimmed">{label}</Text>
    </Stack>
  </Group>
)
