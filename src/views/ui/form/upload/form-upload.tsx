import type { FieldValues, UseControllerProps } from 'react-hook-form'
import type { UploadChangeParam, UploadProps } from '@tinkerbells/xenon-ui'

import * as React from 'react'
import { Controller } from 'react-hook-form'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Upload } from '@tinkerbells/xenon-ui'

import { FormFieldWrapper } from '../form-field-wrapper'

export interface FormUploadProps extends Omit<UploadProps, 'name'> {
  label?: string
}

export function FormUpload<TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  label,
  ...props
}: FormUploadProps & Omit<UseControllerProps<TFieldValues>, 'defaultValue'>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { ref: _, value, onChange, ...controllerProps }, fieldState: { error } }) => {
        const handleUploadChange = React.useCallback((info: UploadChangeParam) => {
          onChange(info.fileList)
        }, [onChange])

        return (
          <FormFieldWrapper label={label} error={error?.message}>
            <Upload
              fileList={value}
              onChange={handleUploadChange}
              {...controllerProps}
              {...props}
            >
              { props.children || (
                <Button
                  variant="ghost"
                  type="button"
                  disabled={props.disabled || controllerProps.disabled}
                >
                  <UploadOutlined />
                  {' '}
                  Загрузка
                </Button>
              ) }
            </Upload>
          </FormFieldWrapper>
        )
      }}
    />
  )
}
