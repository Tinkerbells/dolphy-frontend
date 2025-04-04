import React, { useEffect, useRef, useState } from 'react'
import { Box, Group, Text, UnstyledButton } from '@mantine/core'
import { Clock, Home, HomeIcon, PieChart, Search, User } from 'lucide-react'

import styles from './bottom-navigation.module.css'

const navItems = [
  { icon: Home, label: 'Home' },
  { icon: Search, label: 'Search' },
  { icon: PieChart, label: 'Analytics' },
  { icon: Clock, label: 'History' },
  { icon: User, label: 'Profile' },
]

export type NavigationStyle = 'text' | 'background' | 'full'

interface BottomNavigationProps {
  style?: NavigationStyle
  showLabels?: boolean
  specialIcon?: boolean
}

export function BottomNavigation({ style = 'text', showLabels = true, specialIcon = false }: BottomNavigationProps) {
  const [active, setActive] = useState(specialIcon ? 2 : style === 'text' ? 2 : 0)
  const [indicatorStyle, setIndicatorStyle] = useState({ transform: 'translateX(0)', width: '40px' })
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Update indicator position when active item changes
  useEffect(() => {
    if (itemRefs.current[active]) {
      const activeItem = itemRefs.current[active]
      const itemRect = activeItem?.getBoundingClientRect()
      const parentRect = activeItem?.parentElement?.getBoundingClientRect()

      if (itemRect && parentRect) {
        // Calculate center position of the active item relative to its parent
        const itemCenter = itemRect.left + itemRect.width / 2 - parentRect.left

        // Set indicator width based on the active item's width (but not too wide)
        const indicatorWidth = Math.min(itemRect.width * 0.6, 48)

        // Position the indicator in the center of the active item
        setIndicatorStyle({
          transform: `translateX(${itemCenter - indicatorWidth / 2}px)`,
          width: `${indicatorWidth}px`,
        })
      }
    }
  }, [active])

  const items = navItems.map((item, index) => {
    const Icon = index === 2 && specialIcon ? HomeIcon : item.icon

    const isActive = index === active
    let itemClassName = styles.navItem

    if (isActive) {
      if (style === 'text') {
        itemClassName = `${styles.navItem} ${styles.activeItem}`
      }
      else if (style === 'background') {
        itemClassName = `${styles.navItem} ${styles.activeItemBg}`
      }
      else if (style === 'full') {
        itemClassName = `${styles.navItem} ${styles.activeItemFull}`
      }
    }

    return (
      <UnstyledButton
        key={item.label}
        className={itemClassName}
        onClick={() => setActive(index)}
        ref={el => (itemRefs.current[index] = el)}
      >
        <Icon size={24} />
        {(showLabels || (isActive && style === 'text')) && <Text className={styles.navText}>{item.label}</Text>}
      </UnstyledButton>
    )
  })

  return (
    <Box className={styles.wrapper}>
      <Group className={styles.navGroup}>
        {items}
        <Box className={styles.indicator} style={indicatorStyle} />
      </Group>
    </Box>
  )
}
