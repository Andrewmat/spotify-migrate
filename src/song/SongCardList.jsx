import * as React from 'react'
import styled from 'styled-components'
import {getSpotifySavedTracks} from '@/StorageService'
import useScript from '@/useScript'
import {searchSpotifyTrack} from '@/YoutubeService'
import SongCard from './SongCard'

/**
 * @typedef {typeof window.gapi} GApi
 * @typedef {import('@Type').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 * @typedef {import('react').Dispatch<import('react').SetStateAction<GApiYoutubeResource[]>>} ReactDispatchYoutubeResources
 * @typedef {import('@Type').SpotifyTrack.Track} SpotifyTrack
 * @typedef {import('react').Dispatch<import('react').SetStateAction<SpotifyTrack[]>>} ReactDispatchSpotifyTracks
 */

export default function SongCardList() {
  /** @type {[SpotifyTrack[], ReactDispatchSpotifyTracks]} */
  const [spotifyTracks, setSpotifyTracks] = React.useState()
  const {
    isLoaded,
    isFailed,
    globalValue,
  } = useScript('https://apis.google.com/js/api.js', {globalName: 'gapi'})

  /** @type {GApi} */
  const gapi = globalValue

  React.useEffect(() => {
    if (!isLoaded) {
      return
    }

    ;(async () => {
      const spotifyTracks = await getSpotifySavedTracks()
      const tracks = spotifyTracks.map(trackItem => trackItem.track)

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
            <SongCard key={track.id} spotifyTrack={track} gapi={gapi} />
          </SongCardListItem>
        ))}
    </SongCardListContainer>
  )
}

const SongCardListContainer = styled.ul`
  list-style: none;
`

const SongCardListItem = styled.li``
