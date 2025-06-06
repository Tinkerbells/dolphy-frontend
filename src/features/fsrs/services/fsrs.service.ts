import { plainToClass } from 'class-transformer'

import type { HttpClient } from '@/common/services/http-client'

import { http } from '@/common/services/http-client'

import type { FsrsRepository } from '../models'
import type { GradeCardDto } from '../models/dto/grade-card.dto'

import { FsrsCardWithContent } from '../models/fsrs.domain'

/**
 * Сервис для работы с fsrs
 */
class FsrsService implements FsrsRepository {
  private readonly baseUrl = 'fsrs'
  constructor(private readonly http: HttpClient) {}

  async grade(dto: GradeCardDto): Promise<FsrsCardWithContent> {
    const json = await this.http.post<FsrsCardWithContent>({ path: `${this.baseUrl}/card/${dto.cardId}/grade`, body: {
      rating: dto.rating,
    } })
    return plainToClass(FsrsCardWithContent, json)
  }

  async findDueByDeckId(deckId: string): Promise<FsrsCardWithContent[]> {
    const json = await this.http.get<FsrsCardWithContent[]>({ path: `${this.baseUrl}/due/deck/${deckId}` })
    return json.map(card => plainToClass(FsrsCardWithContent, card))
  }

  async findDueCards(): Promise<FsrsCardWithContent[]> {
    const json = await this.http.get<FsrsCardWithContent[]>({ path: `${this.baseUrl}/due` })
    return json.map(card => plainToClass(FsrsCardWithContent, card))
  }
}

export const fsrsService = new FsrsService(http)
