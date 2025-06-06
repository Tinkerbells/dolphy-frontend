import { SwipeOrietation } from '@/shared/ui/swiper'

export const getPositionStyles = (orientation: SwipeOrietation) => {
  switch (orientation) {
    case 'right':
      return 'top-0 left-0 rotate-[-15deg]'
    case 'left':
      return 'top-0 right-0 rotate-[15deg]'
    case 'up':
      return 'bottom-0'
    case 'down':
      return 'top-0'
  }
}
