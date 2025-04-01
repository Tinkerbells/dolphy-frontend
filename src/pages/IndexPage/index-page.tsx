import type { FC } from 'react'

import { Input, TextInput } from '@mantine/core'

import { Page } from '@/components/page'

export const IndexPage: FC = () => {
  return (
    <Input.Wrapper label="Input label">
      <Input />
    </Input.Wrapper>
  )
}
