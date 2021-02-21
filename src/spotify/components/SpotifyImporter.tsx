import * as React from 'react'
import SpotifyTrackCard from '@/spotify/components/SpotifyTrackCard'
import {getAllUserSavedTracks} from '@/spotify/services/SpotifyService'
import TextMargin from '@/uikit/TextMargin'
import RoundButton from '@/uikit/RoundButton'
import styled from 'styled-components'
import {loadAllUserSavedTracks} from '@/spotify/services/SpotifyAccountService'
import {device} from '@/css'
import {SpotifyTrack} from '@Type'

type TrackItemType = SpotifyTrack.TrackItem

export default function SpotifyImporter() {
  const [tracks, setTracks] = React.useState<
    TrackItemType[]
  >([])

  const [cachedTracks, setCachedTracks] = React.useState<
    TrackItemType[]
  >()

  const [finished, setFinished] = React.useState(false)
  const [total, setTotal] = React.useState(0)

  const onImportProgress = React.useCallback(
    (
      newTrackItems: TrackItemType[],
      responseTotal: number
    ) => {
      setTracks(currentTrackItems =>
        currentTrackItems.concat(newTrackItems)
      )
      if (responseTotal !== total) {
        setTotal(responseTotal)
      }
    },
    [total]
  )

  React.useEffect(() => {
    ;(async () => {
      const tracks = await loadAllUserSavedTracks()
      if (tracks) {
        setCachedTracks(tracks)
      }
    })()
  }, [])

  async function onImportClick() {
    setFinished(false)
    setTracks([])
    const tracks = await getAllUserSavedTracks({
      onProgress: onImportProgress,
      pageSize: 5,
      limitPages: 3,
      ignoreCached: true,
    })
    setTracks(tracks)
    setFinished(true)
  }

  const showImportFromCache =
    cachedTracks &&
    cachedTracks.length &&
    (tracks == null || tracks.length === 0)

  return (
    <div>
      <div>
        {showImportFromCache && (
          <>
            <TextMargin>
              Found {cachedTracks.length} songs in the
              cache.
            </TextMargin>
            <RoundButton
              variant='accent'
              onClick={() => {
                setTracks(cachedTracks)
              }}
            >
              Import cached songs
            </RoundButton>
            <RoundButton
              variant='base'
              onClick={() => setCachedTracks(undefined)}
            >
              Dismiss
            </RoundButton>
          </>
        )}
      </div>
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
      {tracks && tracks.length ? (
        <TrackList>
          {tracks.filter(Boolean).map(({track}) => (
            <TrackItem key={track.id}>
              <SpotifyTrackCard
                {...track}
                showYoutubeLink
              />
            </TrackItem>
          ))}
        </TrackList>
      ) : null}
    </div>
  )
}

const TrackList = styled.ul`
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: 1fr;
  list-style: none;
  grid-gap: 8px;
  margin: auto;
  max-width: 1326px;

  @media ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`

const TrackItem = styled.li``
