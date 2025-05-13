import { useTranslation } from 'react-i18next'

export function useSignInSchema() {
  const { t } = useTranslation(['auth', 'validation'])

  return {
    fields: [
      {
        name: 'first_name',
        meta: {
          displayType: 'text',
          displayName: 'First Name',
          displayProps: {
            md: 6,
            sm: 6,
          },
        },
      },
      {
        name: 'last_name',
        meta: {
          displayType: 'text',
          displayName: 'Last Name',
          displayProps: {
            md: 6,
            sm: 6,
          },
        },
      },
      {
        name: 'email',
        meta: {
          displayType: 'email',
          displayName: 'Emal',
        },
      },
      {
        name: 'password',
        meta: {
          displayType: 'password',
          displayName: 'Your password',
          validation: {
            min: {
              value: '3',
              errorMsg: t('validation.passwordTooShort'),
            },
            max: {
              value: '20',
              errorMsg: t('validation.passwordTooShort'),
            },
          },
        },
      },
    ],
  }
}
