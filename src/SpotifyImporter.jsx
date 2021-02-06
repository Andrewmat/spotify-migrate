import React, {useCallback, useState} from 'react'
import {getUserSavedTracks} from './SpotifyService'

/**
 * @typedef {import('./d.ts').Spotify.TrackItem} TrackItem
 * */

export default function SpotifyImporter() {
  /** @type {[TrackItem[], (tracks: TrackItem[]) => void]} */
  const [tracks, setTracks] = useState([])
  const [finished, setFinished] = useState(false)
  const [total, setTotal] = useState(0)

  const onImportProgress = useCallback((newTracks, _, responseTotal) => {
    setTracks(currentTracks =>
      currentTracks
        .concat(newTracks)
        .sort((t1, t2) => t2.track.popularity - t1.track.popularity)
    )
    setTotal(responseTotal)
  }, [])

  async function onImportClick() {
    setFinished(false)
    setTracks([])
    await getUserSavedTracks(onImportProgress, 50)
    setFinished(true)
  }

  return (
    <div style={{fontFamily: 'sans-serif'}}>
      <button onClick={onImportClick}>Import songs</button>
      {total > 0 && (
        <>
          <progress
            style={{marginLeft: 5}}
            value={tracks && tracks.length ? tracks.length : 0}
            max={total}
          />
          {!finished && (
            <span style={{display: 'inline-block', marginLeft: 5}}>
              {tracks.length} songs imported / {total} total
            </span>
          )}
        </>
      )}
      {finished && (
        <span style={{display: 'inline-block', marginLeft: 5}}>
          <strong>Finished! {tracks.length} songs imported</strong>
        </span>
      )}
      {tracks && tracks.length ? (
        <ul className='track-list'>
          {tracks.filter(Boolean).map(({track}) => (
            <li key={track.id}>
              <div className='track-item'>
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
