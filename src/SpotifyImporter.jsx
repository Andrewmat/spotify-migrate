import * as React from 'react'
import {getUserSavedTracks} from './SpotifyService'

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
      <button onClick={onImportClick}>Import songs</button>
      {total > 0 && (
        <>
          <progress
            style={{marginLeft: 5}}
            value={tracks && tracks.length ? tracks.length : 0}
            max={total}
          />
          {!finished && (
            <span className='margin-text'>
              {tracks.length} songs imported / {total} total
            </span>
          )}
        </>
      )}
      {finished && (
        <span className='margin-text'>
          <strong>Finished! {tracks.length} songs imported</strong>
        </span>
      )}
      {tracks && tracks.length ? (
        <ul className='track-list'>
          {tracks.filter(Boolean).map(({track}, index) => (
            <li key={track.id}>
              <div className='track-item'>
                <div>{index + 1}) </div>
                {(() => {
                  const image = track.album.images.reduce((minImg, currImg) => {
                    if (!minImg) {
                      return currImg
                    }
                    if (currImg.height < minImg.height) {
                      return currImg
                    }
                    return minImg
                  })
                  return (
                    <div className='album-img'>
                      <img
                        height={image.height}
                        width={image.width}
                        src={image.url}
                        alt={track.album.name}
                        loading='lazy'
                      />
                    </div>
                  )
                })()}
                <div className='track-text'>
                  <div>
                    <a
                      className='track-link'
                      href={track.external_urls.spotify}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {track.name}
                    </a>
                  </div>
                  <div className='artists'>
                    by{' '}
                    <strong>
                      {track.artists.map(artist => (
                        <a
                          key={artist.id}
                          href={artist.external_urls.spotify}
                          target='_blank'
                          rel='noreferrer'
                          className='link-artist'
                        >
                          {artist.name}
                        </a>
                      ))}
                    </strong>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
