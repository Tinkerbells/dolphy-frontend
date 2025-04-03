// src/views/stats/deck-stats-chart.tsx

import React from 'react'
import { Group, Progress, Stack, Text } from '@mantine/core'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import type { DeckDto } from '@/models/decks'

interface DeckStatsChartProps {
  deck: DeckDto
}

export const DeckStatsChart: React.FC<DeckStatsChartProps> = ({ deck }) => {
  // Расчёт статистики для колоды
  const totalCards = deck.cardCount
  const dueCards = deck.newCount + deck.reviewCount + deck.learningCount
  const completedCards = totalCards - dueCards
  const completionRate = totalCards > 0 ? Math.round((completedCards / totalCards) * 100) : 100

  // Данные для круговой диаграммы
  const chartData = [
    { name: 'New', value: deck.newCount, color: '#228BE6' }, // Синий
    { name: 'Review', value: deck.reviewCount, color: '#BE4BDB' }, // Фиолетовый
    { name: 'Learning', value: deck.learningCount, color: '#40C057' }, // Зелёный
    { name: 'Completed', value: completedCards, color: '#CED4DA' }, // Серый
  ].filter(item => item.value > 0)

  // Настраиваемый всплывающий подсказки
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#fff',
          padding: '5px 10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
        >
          <Text size="sm">
            <span style={{ color: payload[0].color }}>●</span>
            {' '}
            {' '}
            {payload[0].name}
            :
            {payload[0].value}
            {' '}
            cards
          </Text>
        </div>
      )
    }
    return null
  }

  return (
    <Stack mt="md">
      <Group>
        <Text fw={500}>Completion Rate:</Text>
        <Text fw={500}>
          {completionRate}
          %
        </Text>
      </Group>

      <Progress
        value={completionRate}
        size="lg"
        radius="xl"
        color={completionRate >= 75 ? 'green' : completionRate >= 50 ? 'blue' : 'orange'}
      />

      <div style={{ width: '100%', height: 200 }}>
        {chartData.length > 0
          ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )
          : (
              <Text ta="center" c="dimmed" style={{ marginTop: '80px' }}>No data to display</Text>
            )}
      </div>

      <Group>
        <Text size="sm">
          Total Cards:
          {totalCards}
        </Text>
        <Text size="sm">
          Due Cards:
          {dueCards}
        </Text>
      </Group>
    </Stack>
  )
}
