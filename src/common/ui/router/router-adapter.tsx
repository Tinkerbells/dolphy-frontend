import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { router } from '@/common/services'

export function RouterServiceAdapter() {
  const navigate = useNavigate()

  const { pathname } = useLocation()

  useEffect(() => {
    router.init({
      navigate: (path, params) =>
        typeof path === 'string'
          ? navigate({ pathname: path, search: params?.search }, {
              replace: params?.replace,
              state: params?.state,
            })
          : navigate(path),
    })
  }, [])

  useEffect(() => {
    router.updatePathname(pathname)
  }, [pathname])

  return null
}
