import type { HttpClient } from '@/common/services/http-client'

import { http } from '@/common/services/http-client'

import type { FsrsRepository } from '../models'
import type { FsrsCardWithContent } from '../models/fsrs.domain'

/**
 * Сервис для работы с fsrs
 */
class FsrsService implements FsrsRepository {
  private readonly baseUrl = 'fsrs'
  constructor(private readonly http: HttpClient) {}
  async findDueByDeckId(deckId: string): Promise<FsrsCardWithContent[]> {
    return this.http.get<FsrsCardWithContent[]>({ path: `${this.baseUrl}/due/deck/${deckId}` })
  }

  async findDueCards(): Promise<FsrsCardWithContent[]> {
    return this.http.get<FsrsCardWithContent[]>({ path: `${this.baseUrl}/due` })
  }
}

export const fsrsService = new FsrsService(http)
