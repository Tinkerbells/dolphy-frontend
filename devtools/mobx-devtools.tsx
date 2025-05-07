// src/mobx-devtools-setup.ts

// Получаем экземпляры хранилищ из контейнера
// const signInStore = container.get<SignInStore>(AuthSymbols.SignInStore)
// const signUpStore = container.get<SignUpStore>(AuthSymbols.SignUpStore)

// Функция для настройки MobX DevTools
export function setupMobxDevTools() {
  // Проверяем, что мы в режиме разработки
  if (process.env.NODE_ENV === 'development' || import.meta.env.DEV) {
    // Включаем spy для MobX (нужно для некоторых инструментов DevTools)

    // Регистрируем наши хранилища в глобальном объекте для доступа из DevTools
    const globalAny: any = window
    globalAny.__MOBX_STORES__ = {
      // signInStore,
    }

    // Инициализация инструментов разработчика MobX
    import('@mobx-devtools/tools').then((mobxDevtools) => {
      mobxDevtools.injectStores({
        // signInStore,
      })
      console.log('MobX DevTools initialized')
    }).catch((err) => {
      console.error('Failed to load MobX DevTools:', err)
    })
  }
}
