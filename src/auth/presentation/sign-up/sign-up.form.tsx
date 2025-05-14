import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { FormConfig } from '@/core/presentation/ui'
import type { AuthRegisterLoginDto } from '@/auth/domain/dto/auth-register-login.dto'

import { FormBuilder } from '@/core/presentation/ui'

import styles from './sign-up.module.css'

interface SignUpFormProps {
  signUpForm: MobxForm<AuthRegisterLoginDto>
}

export const SignUpForm = observer(({ signUpForm }: SignUpFormProps) => {
  const { t } = useTranslation(['auth', 'validation'])

  const fields: FormConfig<AuthRegisterLoginDto>[] = [
    {
      type: 'text',
      config: {
        control: {
          name: 'firstName',
          label: t('auth:signUp.firstName'),
        },
        textFieldProps: {
          margin: 'normal',
          autoFocus: true,
          id: 'firstName',
          fullWidth: true,
        },
      },
    },
    {
      type: 'text',
      config: {
        control: {
          name: 'lastName',
          label: t('auth:signUp.lastName'),
        },
        textFieldProps: {
          margin: 'normal',
          id: 'lastName',
          fullWidth: true,
        },
      },
    },
    {
      type: 'text',
      config: {
        control: {
          name: 'email',
          label: t('auth:signUp.email'),
        },
        textFieldProps: {
          margin: 'normal',
          autoComplete: 'email',
          type: 'email',
          id: 'email',
          fullWidth: true,
        },
      },
    },
    {
      type: 'text',
      config: {
        control: {
          name: 'password',
          label: t('auth:signUp.password'),
        },
        textFieldProps: {
          margin: 'normal',
          type: 'password',
          autoComplete: 'new-password',
          id: 'password',
          fullWidth: true,
        },
      },
    },
  ]

  return (
    <Box className={styles.signUpForm} component="form" onSubmit={signUpForm.submit}>
      <FormBuilder form={signUpForm} fields={fields} />
      <Box sx={{ mt: 3 }}>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={signUpForm.isSubmitting || !signUpForm.isValid}
        >
          {signUpForm.isSubmitting ? t('common:loading') : t('auth:signUp.submit')}
        </Button>
      </Box>
    </Box>
  )
})

