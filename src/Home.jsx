import React, {useState} from 'react'
import HasAuth from './HasAuth'
import {openAuthDialog, getUserSavedTracksPaginated} from './SpotifyService'

/**
 * @typedef {import('./d.ts').Spotify.TrackItem} TrackItem
 * */

export default function Home() {
  /** @type {[TrackItem[], (tracks: TrackItem[]) => void]} */
  const [tracks, setTracks] = useState()

  function onSubscribeClick() {
    openAuthDialog('/auth-spotify')
  }

  async function onImportClick() {
    const response = await getUserSavedTracksPaginated(0)
    setTracks(response.items)
  }

  return (
    <div>
      <h1>Home</h1>
      <HasAuth not>
        <button onClick={onSubscribeClick}>Subscribe Spotify</button>
      </HasAuth>
      <HasAuth>
        <div>Voce esta autenticado</div>
        <button onClick={onImportClick}>Import songs</button>
        {tracks && tracks.length && (
          <ul>
            {tracks.map(({track}) => (
              <li key={track.id}>
                {track.name} - by {track.artists[0].name}
              </li>
            ))}
          </ul>
        )}
      </HasAuth>
    </div>
  )
}
