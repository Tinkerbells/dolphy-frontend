import { decksController } from '@/features/decks/controllers'
import { signInController } from '@/features/auth/controllers/sign-in.controller'
import { signUpController } from '@/features/auth/controllers/sign-up.controller'

// Получаем экземпляры хранилищ из контейнера

// Функция для настройки MobX DevTools
export function setupMobxDevTools() {
  // Проверяем, что мы в режиме разработки
  if (import.meta.env.DEV) {
    // Регистрируем наши хранилища в глобальном объекте для доступа из DevTools
    // Инициализация инструментов разработчика MobX
    import('@mobx-devtools/tools').then((mobxDevtools) => {
      mobxDevtools.injectStores({
        signInController,
        signUpController,
        decksController,
      })
      console.log('MobX DevTools initialized')
    }).catch((err) => {
      console.error('Failed to load MobX DevTools:', err)
    })
  }
}
