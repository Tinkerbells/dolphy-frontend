import type { ReactNode } from 'react'

import { X } from 'lucide-react'
import { forwardRef } from 'react'
import { Drawer as VaulDrawer } from 'vaul'

import styles from './drawer.module.css'

// Types following the structure from the provided type definitions
interface WithFadeFromProps {
  /**
   * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
   * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
   * You can also use px values, which doesn't take screen height into account.
   */
  snapPoints: (number | string)[]
  /**
   * Index of a `snapPoint` from which the overlay fade should be applied. Defaults to the last snap point.
   */
  fadeFromIndex: number
}

interface WithoutFadeFromProps {
  /**
   * Array of numbers from 0 to 100 that corresponds to % of the screen a given snap point should take up.
   * Should go from least visible. Example `[0.2, 0.5, 0.8]`.
   * You can also use px values, which doesn't take screen height into account.
   */
  snapPoints?: (number | string)[]
  fadeFromIndex?: never
}

type DialogProps = {
  activeSnapPoint?: number | string | null
  setActiveSnapPoint?: (snapPoint: number | string | null) => void
  children?: ReactNode
  open?: boolean
  /**
   * Number between 0 and 1 that determines when the drawer should be closed.
   * Example: threshold of 0.5 would close the drawer if the user swiped for 50% of the height of the drawer or more.
   * @default 0.25
   */
  closeThreshold?: number
  /**
   * When `true` the `body` doesn't get any styles assigned from Vaul
   */
  noBodyStyles?: boolean
  onOpenChange?: (open: boolean) => void
  shouldScaleBackground?: boolean
  /**
   * When `false` we don't change body's background color when the drawer is open.
   * @default true
   */
  setBackgroundColorOnScale?: boolean
  /**
   * Duration for which the drawer is not draggable after scrolling content inside of the drawer.
   * @default 500ms
   */
  scrollLockTimeout?: number
  /**
   * When `true`, don't move the drawer upwards if there's space, but rather only change it's height so it's fully scrollable when the keyboard is open
   */
  fixed?: boolean
  /**
   * When `true` only allows the drawer to be dragged by the `<Drawer.Handle />` component.
   * @default false
   */
  handleOnly?: boolean
  /**
   * When `false` dragging, clicking outside, pressing esc, etc. will not close the drawer.
   * Use this in comination with the `open` prop, otherwise you won't be able to open/close the drawer.
   * @default true
   */
  dismissible?: boolean
  onDrag?: (event: React.PointerEvent<HTMLDivElement>, percentageDragged: number) => void
  onRelease?: (event: React.PointerEvent<HTMLDivElement>, open: boolean) => void
  /**
   * When `false` it allows to interact with elements outside of the drawer without closing it.
   * @default true
   */
  modal?: boolean
  nested?: boolean
  onClose?: () => void
  /**
   * Direction of the drawer. Can be `top` or `bottom`, `left`, `right`.
   * @default 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right'
  /**
   * Opened by default, skips initial enter animation. Still reacts to `open` state changes
   * @default false
   */
  defaultOpen?: boolean
  /**
   * When set to `true` prevents scrolling on the document body on mount, and restores it on unmount.
   * @default false
   */
  disablePreventScroll?: boolean
  /**
   * When `true` Vaul will reposition inputs rather than scroll then into view if the keyboard is in the way.
   * Setting it to `false` will fall back to the default browser behavior.
   * @default true when {@link snapPoints} is defined
   */
  repositionInputs?: boolean
  /**
   * Disabled velocity based swiping for snap points.
   * This means that a snap point won't be skipped even if the velocity is high enough.
   * Useful if each snap point in a drawer is equally important.
   * @default false
   */
  snapToSequentialPoint?: boolean
  container?: HTMLElement | null
  /**
   * Gets triggered after the open or close animation ends, it receives an `open` argument with the `open` state of the drawer by the time the function was triggered.
   * Useful to revert any state changes for example.
   */
  onAnimationEnd?: (open: boolean) => void
  preventScrollRestoration?: boolean
  autoFocus?: boolean
} & (WithFadeFromProps | WithoutFadeFromProps)

type ContentProps = React.ComponentPropsWithoutRef<typeof VaulDrawer.Content> & {
  showHandle?: boolean
}

type HandleProps = React.ComponentPropsWithoutRef<'div'> & {
  preventCycle?: boolean
}

// Define our styled components using the types from the declaration file
const StyledDrawer = {
  // Main Root component
  Root: ({ children, ...props }: DialogProps) => (
    <VaulDrawer.Root {...props}>
      {children}
    </VaulDrawer.Root>
  ),

  // Trigger button
  Trigger: forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof VaulDrawer.Trigger>>(
    ({ children, className, ...props }, ref) => (
      <VaulDrawer.Trigger
        className={`${styles.trigger} ${className || ''}`}
        {...props}
        ref={ref}
      >
        {children}
      </VaulDrawer.Trigger>
    ),
  ),

  // Content
  Content: forwardRef<HTMLDivElement, ContentProps>(
    ({ children, className, showHandle = true, ...props }, ref) => (
      <VaulDrawer.Portal>
        <VaulDrawer.Overlay className={styles.overlay} />
        <VaulDrawer.Content
          className={`${styles.content} ${className || ''}`}
          {...props}
          ref={ref}
        >
          <div className={styles.container}>
            {showHandle && (
              <StyledDrawer.Handle className={styles.handle} aria-hidden />
            )}
            <div className={styles.innerContainer}>
              {children}
            </div>
          </div>
        </VaulDrawer.Content>
      </VaulDrawer.Portal>
    ),
  ),

  // Drawer title
  Title: forwardRef<HTMLHeadingElement, React.ComponentPropsWithoutRef<typeof VaulDrawer.Title>>(
    ({ children, className, ...props }, ref) => (
      <VaulDrawer.Title
        className={`${styles.title} ${className || ''}`}
        {...props}
        ref={ref}
      >
        {children}
      </VaulDrawer.Title>
    ),
  ),

  // Handle
  Handle: forwardRef<HTMLDivElement, HandleProps>(
    ({ className, ...props }, ref) => (
      <VaulDrawer.Handle
        className={`${className || ''}`}
        {...props}
        ref={ref}
      />
    ),
  ),

  // Description
  Description: forwardRef<HTMLParagraphElement, React.ComponentPropsWithoutRef<typeof VaulDrawer.Description>>(
    ({ children, className, ...props }, ref) => (
      <VaulDrawer.Description
        className={`${styles.description} ${className || ''}`}
        {...props}
        ref={ref}
      >
        {children}
      </VaulDrawer.Description>
    ),
  ),

  // Close
  Close: forwardRef<HTMLButtonElement, React.ComponentPropsWithoutRef<typeof VaulDrawer.Close>>(
    ({ children, className, ...props }, ref) => (
      <VaulDrawer.Close
        className={`${styles.closeButton} ${className || ''}`}
        {...props}
        ref={ref}
      >
        {children || (
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <X />
          </svg>
        )}
      </VaulDrawer.Close>
    ),
  ),

  // Footer (custom component - not in the original Drawer)
  Footer: forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ children, className, ...props }, ref) => (
      <div
        className={`${styles.footer} ${className || ''}`}
        {...props}
        ref={ref}
      >
        <div className={styles.footerContent}>
          {children}
        </div>
      </div>
    ),
  ),

  // Primary button (custom component)
  PrimaryButton: forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, className, ...props }, ref) => (
      <button
        className={`${styles.primaryButton} ${className || ''}`}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    ),
  ),

  // Secondary button (custom component)
  SecondaryButton: forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
    ({ children, className, ...props }, ref) => (
      <button
        className={`${styles.secondaryButton} ${className || ''}`}
        {...props}
        ref={ref}
      >
        {children}
      </button>
    ),
  ),
}

export type { ContentProps, DialogProps, HandleProps, WithFadeFromProps, WithoutFadeFromProps }
export { StyledDrawer as Drawer }
