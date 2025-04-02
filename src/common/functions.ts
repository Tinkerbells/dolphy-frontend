export function generateId(): UniqueId {
  return Math.random().toString(36).substring(2, 15)
    + Math.random().toString(36).substring(2, 15)
}

export function getCurrentDateTime(): DateTimeString {
  return new Date().toISOString()
}

// Calculate next due date based on card difficulty and answer
export function calculateNextDueDate(
  difficulty: DifficultyLevel,
  status: StudyStatus,
  answer: 'again' | 'hard' | 'good' | 'easy',
): DateTimeString {
  const now = new Date()
  let intervalDays = 0

  if (status === 'new') {
    // New cards go into learning
    intervalDays = answer === 'again' ? 0 : (answer === 'hard' ? 0.1 : (answer === 'good' ? 0.2 : 1))
  }
  else if (status === 'learning' || status === 'relearning') {
    // Learning cards
    if (answer === 'again') {
      intervalDays = 0.1 // 2.4 hours
    }
    else if (answer === 'hard') {
      intervalDays = 0.5 // 12 hours
    }
    else if (answer === 'good') {
      intervalDays = 1 // 1 day
    }
    else { // easy
      intervalDays = 3 // 3 days
    }
  }
  else if (status === 'review') {
    // Review cards - apply spaced repetition algorithm
    const baseFactor = Math.max(1.3, 2.5 - 0.15 * difficulty)

    if (answer === 'again') {
      intervalDays = 0.1 // Back to relearning
    }
    else if (answer === 'hard') {
      intervalDays = 1 * baseFactor * 0.5
    }
    else if (answer === 'good') {
      intervalDays = 1 * baseFactor
    }
    else { // easy
      intervalDays = 1 * baseFactor * 1.5
    }

    // Cap interval based on difficulty
    const maxInterval = 365 * (6 - difficulty)
    intervalDays = Math.min(intervalDays, maxInterval)
  }

  // Calculate the due date
  const dueDate = new Date(now)
  dueDate.setDate(now.getDate() + Math.ceil(intervalDays))

  // For intervals less than a day, set the hours appropriately
  if (intervalDays < 1) {
    const hours = Math.round(intervalDays * 24)
    dueDate.setHours(now.getHours() + hours)
  }

  return dueDate.toISOString()
}

// Determine the next card status based on current status and answer
export function calculateNextStatus(
  currentStatus: StudyStatus,
  answer: 'again' | 'hard' | 'good' | 'easy',
): StudyStatus {
  if (currentStatus === 'new') {
    return 'learning'
  }

  if (currentStatus === 'learning') {
    if (answer === 'again') {
      return 'learning'
    }
    if (answer === 'hard') {
      return 'learning'
    }
    // good or easy promotes to review
    return 'review'
  }

  if (currentStatus === 'review') {
    if (answer === 'again') {
      return 'relearning'
    }
    return 'review'
  }

  if (currentStatus === 'relearning') {
    if (answer === 'again' || answer === 'hard') {
      return 'relearning'
    }
    return 'review'
  }

  return currentStatus // Fallback
}

// Calculate new difficulty level based on current and answer
export function calculateNewDifficulty(
  currentDifficulty: DifficultyLevel,
  answer: 'again' | 'hard' | 'good' | 'easy',
): DifficultyLevel {
  let change = 0

  switch (answer) {
    case 'again':
      change = 1
      break
    case 'hard':
      change = 0.5
      break
    case 'good':
      change = 0
      break
    case 'easy':
      change = -0.5
      break
  }

  // Calculate new difficulty and ensure it stays within bounds
  const newDifficulty = Math.min(5, Math.max(0, currentDifficulty + change)) as DifficultyLevel
  return newDifficulty
}
