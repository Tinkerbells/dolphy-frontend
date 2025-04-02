// src/mobx-devtools-setup.ts
import type { DeckStore } from '../controllers/deck-store'
import type { CardStore } from '../controllers/card-store'
import type { RootStore } from '../controllers/root-store'
import type { StudyStore } from '../controllers/study-store'

import { SYMBOLS } from '../di/symbols'
import { container } from '../di/container'

// Получаем экземпляры хранилищ из контейнера
const deckStore = container.get<DeckStore>(SYMBOLS.DeckStore)
const cardStore = container.get<CardStore>(SYMBOLS.CardStore)
const studyStore = container.get<StudyStore>(SYMBOLS.StudyStore)
const rootStore = container.get<RootStore>(SYMBOLS.RootStore)

// Функция для настройки MobX DevTools
export function setupMobxDevTools() {
  // Проверяем, что мы в режиме разработки
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Включаем spy для MobX (нужно для некоторых инструментов DevTools)

    // Регистрируем наши хранилища в глобальном объекте для доступа из DevTools
    const globalAny: any = window
    globalAny.__MOBX_STORES__ = {
      deckStore,
      cardStore,
      studyStore,
      rootStore,
    }

    // Инициализация инструментов разработчика MobX
    import('@mobx-devtools/tools').then((mobxDevtools) => {
      mobxDevtools.injectStores({
        rootStore,
        deckStore,
        cardStore,
        studyStore,
      })
      console.log('MobX DevTools initialized')
    }).catch((err) => {
      console.error('Failed to load MobX DevTools:', err)
    })
  }
}
