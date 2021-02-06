import React from 'react'
import HasAuth from './HasAuth'
import SpotifyImporter from './SpotifyImporter'
import {openAuthDialog} from './SpotifyService'
export default function Home() {
  function onSubscribeClick() {
    openAuthDialog('/auth-spotify')
  }

  return (
    <div>
      <h1>Home</h1>
      <HasAuth not>
        <button onClick={onSubscribeClick}>Subscribe Spotify</button>
      </HasAuth>
      <HasAuth>
        <SpotifyImporter />
      </HasAuth>
    </div>
  )
}
