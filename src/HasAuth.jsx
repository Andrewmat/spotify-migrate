import React, {useState, useEffect, useMemo} from 'react'
import {getIsAuth} from './SpotifyService'

export default function HasAuth({not, children}) {
  const [isAuthenticated, setIsAuthenticated] = useState()

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      return
    }
    ;(async () => {
      const isAuth = await getIsAuth()
      setIsAuthenticated(isAuth)
    })()
  })

  const showChildren = useMemo(() => {
    const expectedAuthenticated = !not
    return expectedAuthenticated === isAuthenticated
  }, [not, isAuthenticated])

  if (showChildren) {
    return children
  }
  return null
}
