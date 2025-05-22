import type { MobxForm } from 'mobx-react-hook-form'

import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'

import type { CreateDeckDto } from '@/decks/domain'
import { FormConfig } from '@/core/presentation/ui'

interface CreateDeckFormProps {
  createDeckForm: MobxForm<CreateDeckDto>
}

export const CreateDeckForm = observer(({ createDeckForm }: CreateDeckFormProps) => {
  const { t } = useTranslation(['decks', 'common'])
const fields = FormConfig<AuthRegisterLoginDto>[] = [{
    type:"text"
  }, ]


  return (
  )
})
