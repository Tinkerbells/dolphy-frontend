import type { FlexProps } from '@tinkerbells/xenon-ui'

import { Flex, Typography } from '@tinkerbells/xenon-ui'

export interface FormFieldProps extends FlexProps {
  label?: string
  error?: string
}

export function FormFieldWrapper({
  label,
  error,
  children,
  align = 'start',
  ...props
}: FormFieldProps) {
  return (
    <Flex vertical gap="small" align={align} {...props} className="form__field">
      {label && (
        <label className="form__label">{label}</label>
      )}
      {children}
      {error && <Typography color="error">{error}</Typography>}
    </Flex>
  )
}
