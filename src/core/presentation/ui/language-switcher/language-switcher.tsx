import React from 'react'
import { observer } from 'mobx-react-lite'
import LanguageIcon from '@mui/icons-material/Language'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'

import type { I18nPort } from '@/core/domain/ports/i18n.port'

import { I18nPortToken } from '@/core/domain/ports/i18n.port'

import { useInjected } from '../../react'
import { useTranslate } from '../../hooks'

/**
 * Компонент для переключения языка в выпадающем списке
 */
export const LanguageSwitcher: React.FC = observer(() => {
  const { t, getCurrentLanguage, getAvailableLanguages, changeLanguage } = useTranslate('common')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const languages = getAvailableLanguages()
  const currentLanguage = getCurrentLanguage()

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode)
    handleClose()
  }

  return (
    <>
      <Tooltip title={t('language.change')}>
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? 'language-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          color="inherit"
        >
          <LanguageIcon />
        </IconButton>
      </Tooltip>
      <Menu
        id="language-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {languages.map(language => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageSelect(language)}
            selected={currentLanguage === language}
          >
            {t(`language.${language === 'en' ? 'english' : 'russian'}`)}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
})

/**
 * Компонент для переключения языка в виде кнопок
 */
export const LanguageSwitcherButtons: React.FC = observer(() => {
  const { t } = useTranslate()
  const i18nService = useInjected<I18nPort>(I18nPortToken)

  const languages = i18nService.getAvailableLanguages()
  const currentLanguage = i18nService.getCurrentLanguage()

  const handleLanguageSelect = (languageCode: string) => {
    i18nService.changeLanguage(languageCode)
  }

  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {languages.map(language => (
        <Button
          key={language}
          variant={currentLanguage === language ? 'contained' : 'outlined'}
          size="small"
          onClick={() => handleLanguageSelect(language)}
        >
          {t(`language.${language === 'en' ? 'english' : 'russian'}`)}
        </Button>
      ))}
    </Box>
  )
})
