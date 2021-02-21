import * as React from 'react'
import {getIsAuth} from '@/spotify/services/SpotifyService'

export function useAuth() {
  const [
    isAuthenticated,
    setIsAuthenticated,
  ] = React.useState<boolean>()

  React.useEffect(() => {
    if (isAuthenticated !== undefined) {
      return
    }
    ;(async () => {
      const isAuth = await getIsAuth()
      setIsAuthenticated(isAuth)
    })()
  })

  return isAuthenticated
}

export function HasAuth({
  not = false,
  children,
}: React.PropsWithChildren<{
  not: boolean
}>): React.ReactNode | null {
  const isAuthenticated = useAuth()

  const showChildren = React.useMemo(() => {
    const expectedAuthenticated = !not
    return expectedAuthenticated === isAuthenticated
  }, [not, isAuthenticated])

  if (showChildren) {
    return children
  }
  return null
}
