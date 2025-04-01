import type {
  ComponentType,
  ForwardedRef,
  ForwardRefExoticComponent,
  PropsWithoutRef,
  RefAttributes,
} from 'react'

import React, {
  forwardRef,
} from 'react'

export function compose<Props extends object>(
  ...hocs: Array<(component: ComponentType<Props>) => ComponentType<Props>>
): (
    component: ComponentType<Props>,
  ) => ForwardRefExoticComponent<PropsWithoutRef<Props> & RefAttributes<any>> {
  return (component: ComponentType<Props>) => {
    const WrappedComponent = forwardRef<Props, Props>(
      (props, ref: ForwardedRef<Props>) => {
        const ComposedComponent = hocs.reduceRight(
          (wrapped, hoc) => hoc(wrapped),
          component,
        )

        return (
        // eslint-disable-next-line ts/ban-ts-comment
        // @ts-ignore
          <ComposedComponent
            {...props}
            ref={ref}
          />
        )
      },
    )

    WrappedComponent.displayName = `Composed(${component.displayName || component.name || 'Component'})`

    return WrappedComponent
  }
}
