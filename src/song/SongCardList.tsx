import * as React from 'react'
import styled from 'styled-components'
import {getSpotifySavedTracks} from '@/StorageService'
import useScript from '@/useScript'
import SongCard from './SongCard'
import {SpotifyTrack, GoogleApi} from '@Type'

export default function SongCardList() {
  const [spotifyTracks, setSpotifyTracks] = React.useState<
    SpotifyTrack.Track[]
  >()
  const {
    isLoaded,
    isFailed,
    globalValue: gapi,
  } = useScript<GoogleApi.GApi>(
    'https://apis.google.com/js/api.js',
    {globalName: 'gapi'}
  )

  React.useEffect(() => {
    if (!isLoaded) {
      return
    }

    ;(async () => {
      const spotifyTracks = await getSpotifySavedTracks()
      const tracks = spotifyTracks.map(
        trackItem => trackItem.track
      )

      setSpotifyTracks(tracks)
    })()
  }, [isLoaded, gapi])

  if (isFailed) {
    return <div>Failed!</div>
  }

  return (
    <SongCardListContainer>
      {spotifyTracks &&
        spotifyTracks.map(track => (
          <SongCardListItem>
            <SongCard
              key={track.id}
              spotifyTrack={track}
              gapi={gapi}
            />
          </SongCardListItem>
        ))}
    </SongCardListContainer>
  )
}

const SongCardListContainer = styled.ul`
  list-style: none;
`

const SongCardListItem = styled.li``
