import { format } from 'date-fns'
import { Transform } from 'class-transformer'

import { DateFormatter } from '@/common'
import { dateToClassTransformer } from '@/utils/transformers/date-transformer'

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

export class FsrsCard extends DateFormatter {
  id: string
  cardId: Card['id']
  @Transform(dateToClassTransformer)
  due: Date

  stability: number
  difficulty: number
  elapsed_days: number
  scheduled_days: number
  reps: number
  lapses: number
  state: State
  @Transform(dateToClassTransformer)
  last_review?: Date

  @Transform(dateToClassTransformer)
  suspended: Date

  deleted: boolean
  @Transform(dateToClassTransformer)
  createdAt: string

  constructor() {
    super()
  }

  public get stateColor() {
    const state = this.state
    switch (state) {
      case State.New:
        return 'primary'
      case State.Learning:
        return 'warning'
      case State.Review:
        return 'success'
      case State.Relearning:
        return 'error'
      default:
        return 'default'
    }
  }
}

export class FsrsCardWithContent extends FsrsCard {
  card: Card
}
