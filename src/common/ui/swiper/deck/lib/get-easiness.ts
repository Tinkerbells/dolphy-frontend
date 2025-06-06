import { SwipeDirection } from '@/shared/ui/swiper'

export const getEasiness = (orientation: SwipeDirection) => {
  switch (orientation) {
    case 'right':
      return 'good'
    case 'left':
      return 'again'
    case 'up':
      return 'easy'
    case 'down':
      return 'hard'
  }
}
