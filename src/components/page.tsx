import type { PropsWithChildren } from 'react'

import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { hideBackButton, onBackButtonClick, showBackButton } from '@telegram-apps/sdk-react'

export function Page({ children, back = true }: PropsWithChildren<{
  /**
   * True if it is allowed to go back from this page.
   */
  back?: boolean
}>) {
  const navigate = useNavigate()

  useEffect(() => {
    if (back) {
      showBackButton()
      return onBackButtonClick(() => {
        navigate(-1)
      })
    }
    hideBackButton()
  }, [back])

  return (
    <>
      {children}
    </>
  )
}
