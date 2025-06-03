import 'i18next'

// import type auth from '../../public/locales/en/auth.json'
// import type decks from '../../public/locales/en/decks.json'
// import type cards from '../../public/locales/en/cards.json'
// import type notes from '../../public/locales/en/notes.json'
// import type common from '../../public/locales/en/common.json'
// import type validation from '../../public/locales/en/validation.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    // Дефолтное пространство имен
    defaultNS: 'common'

    // Определение ресурсов на основе импортированных JSON
    // resources: {
    // common: typeof common
    // auth: typeof auth
    // validation: typeof validation
    // decks: typeof decks
    // cards: typeof cards
    // notes: typeof notes
    // }

    returnNull: false
    returnObjects: false
    keySeparator: '.'
    nsSeparator: ':'
    allowObjectInHTMLChildren: false
    strictKeyChecks: true
  }
}
