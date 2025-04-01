import type { ComponentType, JSX } from 'react'

import { InitDataPage } from '@/pages/InitDataPage.tsx'
import { IndexPage } from '@/pages/IndexPage/index-page'
import { ThemeParamsPage } from '@/pages/ThemeParamsPage.tsx'
import { LaunchParamsPage } from '@/pages/LaunchParamsPage.tsx'

interface Route {
  path: string
  Component: ComponentType
  title?: string
  icon?: JSX.Element
}

export const routes: Route[] = [
  { path: '/', Component: IndexPage },
  { path: '/init-data', Component: InitDataPage, title: 'Init Data' },
  { path: '/theme-params', Component: ThemeParamsPage, title: 'Theme Params' },
  { path: '/launch-params', Component: LaunchParamsPage, title: 'Launch Params' },
]
