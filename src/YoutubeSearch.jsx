import * as React from 'react'
import {useParams, useLocation} from 'react-router-dom'
import useScript from './useScript'
import {
  checkSubscribed,
  rateVideo,
  searchMusicVideo,
  subscribe,
} from './YoutubeService'

/**
 * @typedef {import('./d.ts').GoogleApi.GApi} GApi
 * @typedef {import('./d.ts').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 * @typedef {import('react').Dispatch<import('react').SetStateAction<GApiYoutubeResource[]>>} ReactDispatchYoutubeResources
 */

export default function YoutubeSearch(props) {
  const params = Object.fromEntries(new URLSearchParams(useLocation().search))
  const q = {
    name: params.name,
    artist: params.artist,
  }

  const {
    isLoaded,
    isFailed,
    globalValue,
  } = useScript('https://apis.google.com/js/api.js', {globalName: 'gapi'})

  const [isSignedIn, setSignedIn] = React.useState(false)

  /** @type {[YoutubeResource[], ReactDispatchYoutubeResources]} */
  const [searchResult, setSearchResult] = React.useState([])

  /** @type {GApi} */
  const gapi = globalValue

  React.useEffect(() => {
    if (!isLoaded) {
      return
    }
    ;(async () => {
      if (await checkSubscribed(gapi)) {
        setSignedIn(true)
      }
    })()
  }, [isLoaded, gapi])

  React.useEffect(() => {
    if (!isLoaded || !isSignedIn) {
      return
    }
    ;(async () => {
      const term = [q.name, q.artist].map(v => `"${v}"`).join(' ')
      const results = await searchMusicVideo(gapi, term)
      setSearchResult(results)
    })()
  }, [gapi, isLoaded, isSignedIn, q.name, q.artist])

  async function subscribeYoutube() {
    await subscribe(gapi)
    setSignedIn(true)
  }

  async function saveVideo(id) {
    await rateVideo(gapi, id, 'like')
    console.log('deu certo!')
  }

  if (isFailed) {
    return <span>Deu erro!</span>
  }

  return (
    <span>
      {!isSignedIn ? (
        <button onClick={subscribeYoutube} disabled={!isLoaded}>
          Youtube
        </button>
      ) : (
        <>
          {searchResult.length > 0 && (
            <ul>
              {searchResult.map(result => (
                <li key={result.id.videoId}>
                  <a
                    href={`https://www.youtube.com/watch?v=${result.id.videoId}`}
                    target='_blank'
                    rel='noreferrer'
                  >
                    {result.snippet.title}
                  </a>
                  <button onClick={() => saveVideo(result.id.videoId)}>
                    Save
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </span>
  )
}
