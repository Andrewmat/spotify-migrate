import * as React from 'react'
import {getAllUserSavedTracks} from '@/spotify/services/SpotifyService'
import TextMargin from '@/uikit/TextMargin'
import RoundButton from '@/uikit/RoundButton'
import SpotifyImporterCache from './SpotifyImporterCache'
import SpotifyImporterTrackList from './SpotifyImporterTrackList'
import {SpotifyTrack} from '@Type'
import styled from 'styled-components'
import SpotifyCsvExporter from './SpotifyCsvExporter'

type TrackItem = SpotifyTrack.TrackItem

export default function SpotifyImporter() {
  const [tracks, setTracks] = React.useState<TrackItem[]>(
    []
  )

  const [finished, setFinished] = React.useState(false)
  const [total, setTotal] = React.useState(0)

  React.useEffect(() => {
    if (!finished) {
      return
    }
    setTracks(currentTracks =>
      currentTracks
        .concat()
        .sort(
          (a, b) =>
            new Date(b.added_at).getTime() -
            new Date(a.added_at).getTime()
        )
    )
  }, [finished])

  const onImportProgress = React.useCallback(
    (newTrackItems: TrackItem[], responseTotal: number) => {
      setTracks(currentTrackItems =>
        currentTrackItems.concat(newTrackItems)
      )
      if (responseTotal !== total) {
        setTotal(responseTotal)
      }
    },
    [total]
  )

  async function onImportClick() {
    setFinished(false)
    setTracks([])
    const tracks = await getAllUserSavedTracks({
      onProgress: onImportProgress,
    })
    setTracks(tracks)
    setFinished(true)
  }

  const showImportFromCache =
    tracks == null || tracks.length === 0

  return (
    <Container>
      {showImportFromCache && (
        <SpotifyImporterCache
          onCacheChoice={cachedTracks => {
            setTracks(cachedTracks)
            setFinished(true)
          }}
        />
      )}
      <div>
        {(tracks == null || tracks.length <= 0) && (
          <RoundButton
            variant='accent'
            onClick={onImportClick}
          >
            Import songs from Spotify
          </RoundButton>
        )}
      </div>
      {total > 0 && (
        <>
          <progress
            style={{marginLeft: 5}}
            value={
              tracks && tracks.length ? tracks.length : 0
            }
            max={total}
          />
          {!finished && (
            <TextMargin>
              {tracks.length} songs imported / {total} total
            </TextMargin>
          )}
        </>
      )}
      {finished && (
        <TextMargin>
          <strong>
            Finished! {tracks.length} songs imported
          </strong>
        </TextMargin>
      )}
      <SpotifyCsvExporter tracks={tracks} />
      <SpotifyImporterTrackList tracks={tracks} />
    </Container>
  )
}

const Container = styled.div``
