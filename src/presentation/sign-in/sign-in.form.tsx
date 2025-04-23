import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  IconButton,
  InputAdornment,
} from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

import { Form } from '../common/form'
import styles from './sign-in.module.css'

// Define form schema with validation
const signInSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

// Form data type
type SignInFormData = z.infer<typeof signInSchema>

export function SignInForm() {
  const [showPassword, setShowPassword] = useState(false)

  // Initialize form with react-hook-form
  const methods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Handle form submission
  const onSubmit = async (data: SignInFormData) => {
    console.log(data)
  }

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {

  }

  // Create sign-in form using Form Builder
  const FormComponent = new Form(methods, {
    submitText: 'Sign In',
    onSubmit,
  })
    .input('email', {
      required: true,
      fullWidth: true,
      id: 'email',
      label: 'Email Address',
      autoComplete: 'email',
      autoFocus: true,
      margin: 'normal',
      sx: { mb: 2 },
    })
    .input('password', {
      required: true,
      fullWidth: true,
      label: 'Password',
      type: showPassword ? 'text' : 'password',
      id: 'password',
      autoComplete: 'current-password',
      InputProps: {
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setShowPassword(!showPassword)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      },
    })
    .build()

  return (
    <FormComponent className={styles.signInForm} />
  )
}
