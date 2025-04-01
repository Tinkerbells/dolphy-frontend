import './navigation.modules.css'

import { createElement } from 'react'
import { observer } from 'mobx-react-lite'
import { Tooltip, UnstyledButton } from '@mantine/core'
import { useLocation, useNavigate } from 'react-router-dom'
import { isMiniAppDark, useSignal } from '@telegram-apps/sdk-react'
import { BookOpen, Home, Plus, Search, Settings } from 'lucide-react'

function NavbarLink({ icon: Icon, label, active, onClick }) {
  return (
    <Tooltip label={label} position="top" withArrow transitionProps={{ duration: 0 }}>
      <UnstyledButton
        onClick={onClick}
        className={`nav-link ${active ? 'active' : ''}`}
      >
        {createElement(Icon)}
      </UnstyledButton>
    </Tooltip>
  )
}

// Bottom Navigation Component (integrated with React Router)
export const BottomNavigation = observer(() => {
  const navigate = useNavigate()
  const location = useLocation()
  const isDark = useSignal(isMiniAppDark)

  // Define navigation items that match your app's routes
  const navItems = [
    { icon: Home, label: 'Decks', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: BookOpen, label: 'Study', path: '/study' },
    { icon: Plus, label: 'Add', path: '/card/new' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ]

  const getActiveIndex = () => {
    const path = location.pathname

    // Check exact matches first
    const exactMatch = navItems.findIndex(item => item.path === path)
    if (exactMatch !== -1)
      return exactMatch

    // Check for partial matches (for study path)
    if (path.startsWith('/study/'))
      return 2

    // Check for add card
    if (path.startsWith('/card/new/'))
      return 3

    return 0 // Default to home
  }

  const links = navItems.map((item, index) => (
    <NavbarLink
      key={item.label}
      icon={item.icon}
      label={item.label}
      active={index === getActiveIndex()}
      onClick={() => {
        // Special case for "Add" since it needs a deck ID
        if (item.label === 'Add') {
          const deckMatch = location.pathname.match(/^\/deck\/(\w+)/)
          if (deckMatch) {
            navigate(`/card/new/${deckMatch[1]}`)
          }
          else {
            navigate('/')
          }
        }
        else if (item.label === 'Study' && !location.pathname.startsWith('/study/')) {
          navigate('/')
        }
        else {
          navigate(item.path)
        }
      }}
    />
  ))

  return (
    <div className={`nav-wrapper ${isDark ? 'dark' : ''}`}>
      <nav className="navbar">
        {links}
      </nav>
    </div>
  )
})
