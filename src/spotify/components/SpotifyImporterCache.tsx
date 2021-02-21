import * as React from 'react'
import styled from 'styled-components'
import {loadAllUserSavedTracks} from '@/spotify/services/SpotifyService'
import {SpotifyTrack} from '@Type'
import RoundButton from '@/uikit/RoundButton'
import TextMargin from '@/uikit/TextMargin'

type TrackItem = SpotifyTrack.TrackItem

export default function SpotifyImporterCache({
  onCacheChoice,
}: {
  onCacheChoice(cachedTracks: TrackItem[]): void
}) {
  const [cachedTracks, setCachedTracks] = React.useState<
    TrackItem[]
  >()

  React.useEffect(() => {
    ;(async () => {
      const tracks = await loadAllUserSavedTracks()
      if (tracks) {
        setCachedTracks(tracks)
      }
    })()
  }, [])

  const showImportFromCache =
    cachedTracks && cachedTracks.length

  if (!showImportFromCache) {
    return null
  }

  return (
    <Container>
      <TextMargin>
        Found {cachedTracks.length} songs in the cache.
      </TextMargin>
      <TextMargin>
        <RoundButton
          variant='accent'
          onClick={() => {
            onCacheChoice(cachedTracks)
          }}
        >
          Import cached songs
        </RoundButton>
      </TextMargin>
      <TextMargin>
        <RoundButton
          variant='base'
          onClick={() => setCachedTracks(undefined)}
        >
          Dismiss
        </RoundButton>
      </TextMargin>
    </Container>
  )
}

const Container = styled.div`
  margin: 5px;
`
