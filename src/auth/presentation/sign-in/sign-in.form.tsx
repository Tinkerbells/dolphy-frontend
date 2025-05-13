import MuiForms from 'mui-forms'
// src/auth/presentation/sign-in/sign-in.form.tsx
import { useEffect } from 'react'
import { Box } from '@mui/material'
import { observer } from 'mobx-react-lite'

import { useInjected } from '@/core/presentation/react'

import styles from './sign-in.module.css'
import { SignInStore } from './sign-in.store'
import { useSignInSchema } from './sign-in.schema'

export const SignInForm = observer(() => {
  // const store = useInjected<SignInStore>(SignInStore)
  const schema = useSignInSchema()
  console.log(schema)

  useEffect(() => {
    // Reset form error when component mounts
    // if (store.login.error) {
    //   store.login.reset()
    // }
  }, [])

  const handleSubmit = (formData: any) => {
    console.log(formData)
    // store.handleSignIn(formData)
  }

  return (
    <Box className={styles.signInForm}>
      <MuiForms
        schema={schema}
        onSubmit={handleSubmit}
        config={{
          size: 'medium',
          variant: 'outlined',
          loader: {
            enabled: true,
            color: 'primary',
          },
        }}
      />
    </Box>
  )
})
