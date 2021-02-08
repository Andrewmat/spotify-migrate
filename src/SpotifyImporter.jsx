import * as React from 'react'
import SpotifyTrackCard from './SpotifyTrackCard'
import {getAllUserSavedTracks} from './SpotifyService'
import TextMargin from './styled/TextMargin'
import Button from './styled/Button'
import styled from 'styled-components'
import {loadAllUserSavedTracks} from './SpotifyAccountService'
import {device} from './css'

/**
 * @typedef {import('./d.ts').SpotifyTrack.TrackItem} TrackItem
 * @typedef {import('react').Dispatch<import('react').SetStateAction<TrackItem[]>>} ReactDispatchTrackItems
 * */

export default function SpotifyImporter() {
  /** @type {[TrackItem[], ReactDispatchTrackItems]} */
  const [tracks, setTracks] = React.useState([])

  /** @type {[TrackItem[], ReactDispatchTrackItems]} */
  const [cachedTracks, setCachedTracks] = React.useState()

  const [finished, setFinished] = React.useState(false)
  const [total, setTotal] = React.useState(0)

  const onImportProgress = React.useCallback(
    (newTrackItems, responseTotal) => {
      setTracks(currentTrackItems => currentTrackItems.concat(newTrackItems))
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
      // pageSize: 5,
      // limitPages: 2,
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
              Found {cachedTracks.length} songs in the cache.
            </TextMargin>
            <Button
              onClick={() => {
                setTracks(cachedTracks)
              }}
            >
              Import cached songs
            </Button>
            <Button
              theme='secondary'
              onClick={() => setCachedTracks(undefined)}
            >
              Dismiss
            </Button>
          </>
        )}
      </div>
      <div>
        {(tracks == null || tracks.length <= 0) && (
          <Button onClick={onImportClick}>Import songs from Spotify</Button>
        )}
      </div>
      {total > 0 && (
        <>
          <progress
            style={{marginLeft: 5}}
            value={tracks && tracks.length ? tracks.length : 0}
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
          <strong>Finished! {tracks.length} songs imported</strong>
        </TextMargin>
      )}
      {tracks && tracks.length ? (
        <TrackList>
          {tracks.filter(Boolean).map(({track}) => (
            <TrackItem key={track.id}>
              <SpotifyTrackCard {...track} />
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
