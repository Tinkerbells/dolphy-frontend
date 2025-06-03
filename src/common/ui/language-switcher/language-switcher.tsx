import React from 'react'
import { observer } from 'mobx-react-lite'
import { useTranslation } from 'react-i18next'
import LanguageIcon from '@mui/icons-material/Language'
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material'

import { getCountryFlag } from './get-country-flag'

/**
 * Компонент для переключения языка в выпадающем списке
 */
export const LanguageSwitcher = observer(() => {
  const { t, i18n: { changeLanguage, language: currentLanguage, languages } } = useTranslation('common')
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

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
        {languages?.map(language => (
          <MenuItem
            key={language}
            onClick={() => handleLanguageSelect(language)}
            selected={currentLanguage === language}
          >
            {getCountryFlag(language)}
            &nbsp;
            {/* @ts-expect-error - i18n function returns unknown type */}
            {String(t(`language.${language}`))}
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
  const { t, i18n: { language: currentLanguage, languages, changeLanguage } } = useTranslation('common')
  return (
    <Box sx={{ display: 'flex', gap: 1 }}>
      {languages?.map(language => (
        <Button
          key={language}
          variant={currentLanguage === language ? 'contained' : 'outlined'}
          size="small"
          onClick={() => changeLanguage(language)}
        >
          {/* @ts-expect-error - i18n function returns unknown type */}
          {String(t(`language.${language}`))}
        </Button>
      ))}
    </Box>
  )
})
