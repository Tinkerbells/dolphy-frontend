/**
 * Возвращает эмодзи флага Unicode для указанного кода страны/языка
 * @param countryCode - Код языка ISO 639-1 (например, "en", "ru") или
 *                      Код страны ISO 3166-1 alpha-2 (например, "US", "RU")
 * @returns Эмодзи флага Unicode или undefined, если код недействителен
 */
export function getCountryFlag(countryCode: string): string | undefined {
  // Нормализуем код страны в верхний регистр
  const code = countryCode.trim().toUpperCase()

  // Карта соответствия кодов языков кодам стран для часто используемых случаев
  const languageToCountry: Record<string, string> = {
    EN: 'GB', // Английский -> Великобритания
    RU: 'RU', // Русский -> Россия
    ES: 'ES', // Испанский -> Испания
    FR: 'FR', // Французский -> Франция
    DE: 'DE', // Немецкий -> Германия
    IT: 'IT', // Итальянский -> Италия
    ZH: 'CN', // Китайский -> Китай
    JA: 'JP', // Японский -> Япония
    KO: 'KR', // Корейский -> Южная Корея
    AR: 'SA', // Арабский -> Саудовская Аравия
    HI: 'IN', // Хинди -> Индия
    PT: 'PT', // Португальский -> Португалия
    // Добавьте больше соответствий при необходимости
  }

  // Если предоставлен языковой код, преобразуем его в код страны
  const countryCodeToUse = languageToCountry[code] || code

  // Возвращаем undefined для недействительных кодов
  if (countryCodeToUse.length !== 2) {
    return undefined
  }

  // Преобразуем код страны в эмодзи флага Unicode
  // Каждый флаг Unicode состоит из 2 символов регионального индикатора
  // Каждый символ регионального индикатора формируется путем добавления
  // смещения 127397 (0x1F1A5) к ASCII-коду прописной буквы
  try {
    const codePoints = [...countryCodeToUse].map(char =>
      char.charCodeAt(0) + 127397,
    )

    return String.fromCodePoint(...codePoints)
  }
  catch (error) {
    console.error(error)
    return undefined
  }
}

// Примеры использования:
// getCountryFlag("en") => "🇬🇧"
// getCountryFlag("ru") => "🇷🇺"
// getCountryFlag("us") => "🇺🇸"
