import type { FieldValues } from 'react-hook-form'

import type { FormInputCheckboxProps, FormInputCustomProps, FormInputManyOptionSingleChoiceProps, FormInputMultiCheckboxProps, FormInputProps, FormInputRadioProps, FormInputSelectProps, FormInputSwitchProps, FormInputTextProps } from './inputs'

import { FormInputCheckbox, FormInputCustom, FormInputManyOptionSingleChoice, FormInputMultiCheckbox, FormInputRadio, FormInputSelect, FormInputSwitch, FormInputText } from './inputs'

export function FormInput<TFieldValues extends FieldValues = FieldValues>({ type, config }: Config<TFieldValues>) {
  switch (type) {
    case 'select': {
      const { control, ...restProps } = config as unknown as SelectConfig<TFieldValues>['config']
      return <FormInputSelect {...control} {...restProps} />
    }
    case 'text': {
      const { control, ...restProps } = config as unknown as TextConfig<TFieldValues>['config']
      return <FormInputText {...control} {...restProps} />
    }
    case 'radio': {
      const { control, ...restProps } = config as unknown as RadioConfig<TFieldValues>['config']
      return <FormInputRadio {...control} {...restProps} />
    }
    case 'checkbox': {
      const { control, ...restProps } = config as unknown as CheckboxConfig<TFieldValues>['config']
      return <FormInputCheckbox {...control} {...restProps} />
    }
    case 'custom': {
      const { control, ...restProps } = config as unknown as CustomOverrideConfig<TFieldValues>['config']
      return <FormInputCustom {...restProps} {...control} />
    }
    case 'switch': {
      const { control, ...restProps } = config as unknown as SwitchConfig<TFieldValues>['config']
      return <FormInputSwitch {...control} {...restProps} />
    }
    case 'manyOptionsSingleChoice': {
      const { control, ...restProps } = config as unknown as ManyOptionSingleChoiceConfig<TFieldValues>['config']
      return <FormInputManyOptionSingleChoice {...control} {...restProps} />
    }
    case 'multiCheckbox': {
      const { control, ...restProps } = config as unknown as MultiCheckboxConfig<TFieldValues>['config']
      return <FormInputMultiCheckbox {...control} {...restProps} />
    }
    default:
      throw new Error(
        `Unsupported input type: ${type} given. Expected one of: 'text', 'select', 'radio', 'custom', 'switch', 'checkbox', 'manyOptionsSingleChoice', 'multiCheckbox'`,
      )
  }
}
interface InputControl<TFieldValues extends FieldValues = FieldValues> {
  control: FormInputProps<TFieldValues>
}
interface SelectConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'select'
  config: InputControl<TFieldValues> & FormInputSelectProps
}
interface TextConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'text'
  config: InputControl<TFieldValues> & FormInputTextProps
}

interface RadioConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'radio'
  config: InputControl<TFieldValues> & FormInputRadioProps
}

interface CheckboxConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'checkbox'
  config: InputControl<TFieldValues> & FormInputCheckboxProps
}

interface CustomOverrideConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'custom'
  config: {
    control: FormInputCustomProps<TFieldValues>
  }
}

interface SwitchConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'switch'
  config: InputControl<TFieldValues> & FormInputSwitchProps
}

interface MultiCheckboxConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'multiCheckbox'
  config: InputControl<TFieldValues> & FormInputMultiCheckboxProps
}

interface ManyOptionSingleChoiceConfig<TFieldValues extends FieldValues = FieldValues> {
  type: 'manyOptionsSingleChoice'
  config: InputControl<TFieldValues> & FormInputManyOptionSingleChoiceProps
}

export type Config<TFieldValues extends FieldValues = FieldValues> =
  | TextConfig<TFieldValues>
  | SelectConfig<TFieldValues>
  | RadioConfig<TFieldValues>
  | CheckboxConfig<TFieldValues>
  | CustomOverrideConfig<TFieldValues>
  | SwitchConfig<TFieldValues>
  | ManyOptionSingleChoiceConfig<TFieldValues>
  | MultiCheckboxConfig<TFieldValues>
