import type { ButtonProps } from '@mantine/core'

import { Button } from '@mantine/core'

import { classNames } from '@/css/classnames'

import styles from './float-button.module.css'

type Placement = 'top' | 'top-right' | 'right' | 'bottom-right' | 'bottom' | 'bottom-left' | 'left' | 'top-left'

interface FloatButtonProps extends ButtonProps {
  onClick?: () => void
  placement?: Placement
}

export function FloatButton({
  className,
  placement,
  ...props
}: FloatButtonProps) {
  return (
    <Button
      className={classNames(
        styles.floatButton,
        placement && styles[placement],
        className,
      )}
      {...props}
    />
  )
}
