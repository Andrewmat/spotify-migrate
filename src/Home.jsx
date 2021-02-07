import * as React from 'react'
import {HasAuth} from './auth'
import SpotifyImporter from './SpotifyImporter'
import {openAuthDialog} from './SpotifyService'
import Greeting from './Greeting'

export default function Home() {
  function onSubscribeClick() {
    openAuthDialog('/auth-spotify')
  }

  return (
    <div>
      <HasAuth not>
        <button onClick={onSubscribeClick}>Subscribe Spotify</button>
      </HasAuth>
      <HasAuth>
        <Greeting />
        <SpotifyImporter />
      </HasAuth>
    </div>
  )
}
