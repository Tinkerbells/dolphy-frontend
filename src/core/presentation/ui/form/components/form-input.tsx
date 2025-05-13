import type {
  FormInputCheckboxProps,
  FormInputCustomOverrideProps,
  FormInputManyOptionSingleChoiceProps,
  FormInputMultiCheckboxProps,
  FormInputProps,
  FormInputRadioProps,
  FormInputSelectProps,
  FormInputSwitchProps,
  FormInputTextProps,
} from '@/core/presentation/ui/form/ui/inputs'

import {
  FormInputCheckbox,
  FormInputCustomOverride,
  FormInputManyOptionSingleChoice,
  FormInputMultiCheckbox,
  FormInputRadio,
  FormInputSelect,
  FormInputSwitch,
  FormInputText,
} from '@/core/presentation/ui/form/ui/inputs'

export function FormInput<TData>({ type, config }: Config<TData>) {
  switch (type) {
    case 'select': {
      const { control, ...restProps } = config as unknown as SelectConfig<TData>['config']
      return <FormInputSelect {...control} {...restProps} />
    }
    case 'text': {
      const { control, ...restProps } = config as unknown as TextConfig<TData>['config']
      return <FormInputText {...control} {...restProps} />
    }
    case 'radio': {
      const { control, ...restProps } = config as unknown as RadioConfig<TData>['config']
      return <FormInputRadio {...control} {...restProps} />
    }
    case 'checkbox': {
      const { control, ...restProps } = config as unknown as CheckboxConfig<TData>['config']
      return <FormInputCheckbox {...control} {...restProps} />
    }
    case 'custom': {
      const { control, ...restProps } = config as unknown as CustomOverrideConfig<TData>['config']
      return <FormInputCustomOverride {...restProps} {...control} />
    }
    case 'switch': {
      const { control, ...restProps } = config as unknown as SwitchConfig<TData>['config']
      return <FormInputSwitch {...control} {...restProps} />
    }
    case 'manyOptionsSingleChoice': {
      const { control, ...restProps } = config as unknown as ManyOptionSingleChoiceConfig<TData>['config']
      return <FormInputManyOptionSingleChoice {...control} {...restProps} />
    }
    case 'multiCheckbox': {
      const { control, ...restProps } = config as unknown as MultiCheckboxConfig<TData>['config']
      return <FormInputMultiCheckbox {...control} {...restProps} />
    }
    default:
      throw new Error(
        `Unsupported input type: ${type} given. Expected one of: 'text', 'select', 'radio', 'custom', 'switch', 'checkbox', 'manyOptionsSingleChoice', 'multiCheckbox'`,
      )
  }
}
interface InputControl<TData> {
  control: FormInputProps<TData>
}
interface SelectConfig<TData> {
  type: 'select'
  config: InputControl<TData> & FormInputSelectProps
}
interface TextConfig<TData> {
  type: 'text'
  config: InputControl<TData> & FormInputTextProps
}

interface RadioConfig<TData> {
  type: 'radio'
  config: InputControl<TData> & FormInputRadioProps
}

interface CheckboxConfig<TData> {
  type: 'checkbox'
  config: InputControl<TData> & FormInputCheckboxProps
}

interface CustomOverrideConfig<TData> {
  type: 'custom'
  config: {
    control: FormInputCustomOverrideProps<TData>
  }
}

interface SwitchConfig<TData> {
  type: 'switch'
  config: InputControl<TData> & FormInputSwitchProps
}

interface MultiCheckboxConfig<TData> {
  type: 'multiCheckbox'
  config: InputControl<TData> & FormInputMultiCheckboxProps
}

interface ManyOptionSingleChoiceConfig<TData> {
  type: 'manyOptionsSingleChoice'
  config: InputControl<TData> & FormInputManyOptionSingleChoiceProps
}

export type Config<TData> =
  | TextConfig<TData>
  | SelectConfig<TData>
  | RadioConfig<TData>
  | CheckboxConfig<TData>
  | CustomOverrideConfig<TData>
  | SwitchConfig<TData>
  | ManyOptionSingleChoiceConfig<TData>
  | MultiCheckboxConfig<TData>
