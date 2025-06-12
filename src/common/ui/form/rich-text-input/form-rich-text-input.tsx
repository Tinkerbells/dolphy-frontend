import type { FieldPath, FieldValues } from 'react-hook-form'

import { useController } from 'react-hook-form'

import type { RichTextEditorProps } from '../rich-text-editor'

import { RichTextEditor } from '../rich-text-editor'

export interface FormRichTextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<RichTextEditorProps, 'value' | 'onChange' | 'error' | 'helperText'> {
  name: TName
}

export function FormRichTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, ...props }: FormRichTextInputProps<TFieldValues, TName>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController<TFieldValues, TName>({ name })

  return (
    <RichTextEditor
      {...props}
      value={value || ''}
      onChange={onChange}
      error={!!error}
      helperText={error?.message}
    />
  )
}

