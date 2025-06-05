import type { Card } from '../external'

export type StateType = 'New' | 'Learning' | 'Review' | 'Relearning'

export enum State {
  New = 0,
  Learning = 1,
  Review = 2,
  Relearning = 3,
}

export type RatingType = 'Manual' | 'Again' | 'Hard' | 'Good' | 'Easy'

export enum Rating {
  Manual = 0,
  Again = 1,
  Hard = 2,
  Good = 3,
  Easy = 4,
}

export class FsrsCard {
  id: string
  cardId: Card['id']
  due: string
  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: State
  last_review?: string
  suspended: string
  deleted: boolean
  createdAt: string
}

export class FsrsCardWithContent extends FsrsCard {
  card: Card
}
