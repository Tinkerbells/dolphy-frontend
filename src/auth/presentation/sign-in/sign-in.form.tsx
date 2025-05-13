import type { MobxForm } from 'mobx-react-hook-form'

import { useEffect } from 'react'
import { Box, Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

import type { AuthEmailLoginDto } from '@/auth/domain/dto/auth-email-login.dto'
import type { Config } from '@/core/presentation/ui/form/components/form-input'

import { compose } from '@/core/presentation/react'
import { Form } from '@/core/presentation/ui/form/form'
import { withForm } from '@/core/presentation/ui/form/components'

import styles from './sign-in.module.css'

interface SignInFormProps {
  signInForm: MobxForm<AuthEmailLoginDto, any, AuthEmailLoginDto>
}

const enhance = compose<SignInFormProps>(component =>
  (props) => {
    return withForm(component, props.signInForm)(props)
  },
)

export const SignInForm = enhance(({ signInForm }: SignInFormProps) => {
  const { t } = useTranslation(['auth', 'validation'])

  useEffect(() => {
    // if (store.login.) {
    //   store.login.reset()
    // }
  }, [])

  const inputs: Config<AuthEmailLoginDto>[] = [
    {
      type: 'text',
      config: {
        control: {
          name: 'email',
          label: t('auth:signIn.email'),
        },
        textFieldProps: {
          fullWidth: true,
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
          autoComplete: 'current-password',
          id: 'password',
        },
      },
    },
  ]

  return (
    <Box className={styles.signInForm}>
      <form onSubmit={() => signInForm.form?.handleSubmit}>
        <Form inputs={inputs} gridSpacing={1} />
        <Box sx={{ mt: 3 }}>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // disabled={store.login.isLoading}
          >
            {/* {store.login.isLoading ? t('common:loading') : t('auth:signIn.submit')} */}
          </Button>
        </Box>
      </form>
    </Box>
  )
})
