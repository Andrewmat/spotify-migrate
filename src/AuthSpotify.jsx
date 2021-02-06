import React, {useState, useEffect} from 'react'
import {useHistory, useLocation} from 'react-router-dom'
import {resolveAuthCallback} from './SpotifyService'

export default function AuthSpotify() {
  const [resolution, setResolution] = useState('loading')
  const history = useHistory()
  const location = useLocation()
  useEffect(() => {
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
      setTimeout(() => {
        history.push('/')
      }, 3000)
    }
  }, [history, location])

  return (
    <div>
      <div>ola2</div>
      {resolution === 'success' ? (
        <span>Deu certo! Redirecionando para a home</span>
      ) : (
        <span>
          Houve um erro ao tentar se conectar no Spotify. Redirecionando para a
          home.
        </span>
      )}
    </div>
  )
}
