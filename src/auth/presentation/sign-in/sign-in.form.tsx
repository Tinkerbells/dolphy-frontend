import type { MobxForm } from 'mobx-react-hook-form'

import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useMobxForm } from 'mobx-react-hook-form'

import type { FormConfig } from '@/core/presentation/ui'
import type { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'

import { FormBuilder } from '@/core/presentation/ui'

import styles from './sign-in.module.css'

interface SignInFormProps {
  signInForm: MobxForm<AuthEmailLoginDto, any, AuthEmailLoginDto>
}

export function SignInForm({ signInForm }: SignInFormProps) {
  const { t } = useTranslation(['auth', 'validation'])

  const form = useMobxForm(signInForm)

  const fields: FormConfig<AuthEmailLoginDto>[] = [
    {
      type: 'text',
      config: {
        control: {
          name: 'email',
          label: t('auth:signIn.email'),
        },
        textFieldProps: {
          margin: 'normal',
          autoComplete: 'email',
          type: 'email',
          id: 'email',
        },
      },
    },
    {
      type: 'text',
      config: {
        control: {
          name: 'password',
          label: t('auth:signIn.password'),
        },
        textFieldProps: {
          fullWidth: true,
          margin: 'normal',
          type: 'password',
        },
      },
    },
  ]

  return (
    <Box className={styles.signInForm} component="form" onSubmit={form.onSubmit}>
      <FormBuilder form={form} fields={fields} />
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          {signInForm.form?.formState.isSubmitting ? t('common:loading') : t('auth:signIn.submit')}
        </Button>
      </Box>
    </Box>
  )
}
