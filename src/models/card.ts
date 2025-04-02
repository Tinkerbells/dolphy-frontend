import { currentDatetime } from '../lib/datetime'

export class Card {
  id: UniqueId
  front: string // Text content for a card face
  back: string // Text content for a card face
  tags: string[]
  deckId: UniqueId
  created: DateTimeString
  lastReviewed?: DateTimeString
  difficulty: DifficultyLevel
  status: StudyStatus
  dueDate?: DateTimeString
  lapses: number // Number of times the card was forgotten
  interval: number // Current interval in days

  constructor(
    front: string,
    back: string,
    deckId: UniqueId,
    tags: string[] = [],
  ) {
    this.id = crypto.randomUUID()
    this.front = front
    this.back = back
    this.tags = tags
    this.deckId = deckId
    this.created = currentDatetime()
    this.difficulty = 0 // New card
    this.status = 'new'
    this.lapses = 0
    this.interval = 0
  }

  updateDifficulty(newDifficulty: DifficultyLevel): Card {
    const now = currentDatetime()

    // Simple spaced repetition algorithm:
    // - Interval increases based on difficulty (easier = longer intervals)
    // - New interval is calculated as a factor of the previous interval
    const difficultyFactor = 2.5 - (newDifficulty * 0.3) // Range: 1.0 to 2.5
    let newInterval = this.interval

    if (this.status === 'new') {
      newInterval = 1 // First interval for new cards is 1 day
    }
    else {
      newInterval = Math.max(1, Math.round(this.interval * difficultyFactor))
    }

    // Calculate new due date based on interval
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + newInterval)

    // Update status based on difficulty
    let newStatus: StudyStatus = this.status
    let newLapses = this.lapses

    if (newDifficulty <= 1) {
      // Failed - card needs relearning
      newStatus = 'relearning'
      newLapses = this.lapses + 1
      newInterval = 0 // Reset interval for failed cards
    }
    else if (this.status === 'new' || this.status === 'relearning') {
      newStatus = 'learning'
    }
    else {
      newStatus = 'review'
    }

    const updatedCard = new Card(this.front, this.back, this.deckId, this.tags)
    Object.assign(updatedCard, {
      id: this.id,
      created: this.created,
      difficulty: newDifficulty,
      lastReviewed: now,
      status: newStatus,
      dueDate: dueDate.toISOString(),
      interval: newInterval,
      lapses: newLapses,
    })

    return updatedCard
  }

  isDue(): boolean {
    if (!this.dueDate)
      return true // If no due date, always due

    const now = new Date()
    const due = new Date(this.dueDate)
    return now >= due
  }

  static sortByDueness(cards: Card[]): Card[] {
    return [...cards].sort((a, b) => {
      // First sort by status (new > relearning > learning > review)
      const statusOrder: Record<StudyStatus, number> = {
        new: 0,
        relearning: 1,
        learning: 2,
        review: 3,
      }

      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status]
      }

      // Then sort by due date
      if (!a.dueDate)
        return -1
      if (!b.dueDate)
        return 1

      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    })
  }
}
