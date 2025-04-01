// src/lib/datetime.ts
export function currentDatetime(): DateTimeString {
  return new Date().toISOString()
}

export function formatDate(date: DateTimeString): string {
  return new Date(date).toLocaleDateString()
}

export function formatDateTime(date: DateTimeString): string {
  return new Date(date).toLocaleString()
}

export function daysBetween(start: DateTimeString, end: DateTimeString): number {
  const startDate = new Date(start)
  const endDate = new Date(end)
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function addDays(date: DateTimeString, days: number): DateTimeString {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result.toISOString()
}

// Format as relative time (e.g., "2 days ago", "in 3 days")
export function formatRelativeTime(date: DateTimeString): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffTime = targetDate.getTime() - now.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0)
    return 'Today'
  if (diffDays === 1)
    return 'Tomorrow'
  if (diffDays === -1)
    return 'Yesterday'
  if (diffDays > 0)
    return `In ${diffDays} days`
  return `${Math.abs(diffDays)} days ago`
}
