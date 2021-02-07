import * as React from 'react'
import SpotifyTrackCard from './SpotifyTrackCard'
import {getUserSavedTracks} from './SpotifyService'
import TextMargin from './styled/TextMargin'
import Button from './styled/Button'
import styled from 'styled-components'

/**
 * @typedef {import('./d.ts').SpotifyTrack.TrackItem} TrackItem
 * @typedef {import('react').Dispatch<import('react').SetStateAction<TrackItem[]>>} ReactDispatchTrackItems
 * */

export default function SpotifyImporter() {
  /** @type {[TrackItem[], ReactDispatchTrackItems]} */
  const [tracks, setTracks] = React.useState([])
  const [finished, setFinished] = React.useState(false)
  const [total, setTotal] = React.useState(0)

  const onImportProgress = React.useCallback(
    (newTrackItems, responseTotal) => {
      setTracks(currentTrackItems =>
        currentTrackItems
          .concat(newTrackItems)
          .sort((t1, t2) => t2.track.popularity - t1.track.popularity)
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
    await getUserSavedTracks(onImportProgress, 50)
    setFinished(true)
  }

  return (
    <div>
      <Button onClick={onImportClick}>Import songs</Button>
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
  width: fit-content;
  max-width: 500px;
`

const TrackItem = styled.li``
