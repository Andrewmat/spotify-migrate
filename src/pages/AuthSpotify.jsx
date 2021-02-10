import * as React from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {resolveAuthCallback} from '@/spotify/services/SpotifyService'

export default function AuthSpotify() {
  const [resolution, setResolution] = React.useState('loading')
  const history = useHistory()
  const location = useLocation()
  React.useEffect(() => {
    let authToken
    try {
      authToken = resolveAuthCallback(location)
    } catch (e) {
      console.error(e)
      setResolution('failure')
    }
    if (authToken) {
      setResolution('success')
      redirectHome()
    } else {
      setResolution('failure')
      redirectHome()
    }
    function redirectHome() {
      history.push('/')
    }
  }, [history, location])

  return (
    <div>
      {resolution === 'success' ? (
        <span>You're logged in. Redirecting to home</span>
      ) : (
        <span>
          There has been an error trying to subscribe to Spotify. Redirecting to
          home
        </span>
      )}
    </div>
  )
}
