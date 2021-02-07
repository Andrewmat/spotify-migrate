import * as React from 'react'
import {HasAuth} from './auth'
import SpotifyImporter from './SpotifyImporter'
import {openAuthDialog} from './SpotifyService'
import Greeting from './Greeting'
import Button from './styled/Button'

export default function Home() {
  function onSubscribeClick() {
    openAuthDialog('/auth-spotify')
  }

  return (
    <div>
      <HasAuth not>
        <Button onClick={onSubscribeClick}>Subscribe Spotify</Button>
      </HasAuth>
      <HasAuth>
        <Greeting />
        <SpotifyImporter />
      </HasAuth>
    </div>
  )
}
