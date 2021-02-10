import * as React from 'react'
import useScript from './useScript'
import {checkSubscribed, searchMusicVideo, subscribe} from './YoutubeService'

/**
 * @typedef {import('./d.ts').GoogleApi.GApi} GApi
 * @typedef {import('./d.ts').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 * @typedef {import('react').Dispatch<import('react').SetStateAction<GApiYoutubeResource[]>>} ReactDispatchYoutubeResources
 */

export default function YoutubeSearch() {
  const {
    isLoaded,
    isFailed,
    globalValue,
  } = useScript('https://apis.google.com/js/api.js', {globalName: 'gapi'})

  const [isSignedIn, setSignedIn] = React.useState(false)
  const [term, setTerm] = React.useState('')

  /** @type {[YoutubeResource[], ReactDispatchYoutubeResources]} */
  const [searchResult, setSearchResult] = React.useState([])

  /** @type {GApi} */
  const gapi = globalValue

  React.useEffect(() => {
    ;(async () => {
      if (!isLoaded) {
        return
      }
      if (await checkSubscribed(gapi)) {
        setSignedIn(true)
      }
    })()
  }, [isLoaded, gapi])

  async function subscribeYoutube() {
    await subscribe(gapi)
    setSignedIn(true)
  }

  /** @param {Event} e */
  async function onSubmitSearch(e) {
    e.preventDefault()
    const results = await searchMusicVideo(gapi, term)
    setSearchResult(results)
  }

  if (isFailed) {
    return <span>Deu erro!</span>
  }

  return (
    <span>
      Deu sucesso!
      {!isSignedIn ? (
        <button onClick={subscribeYoutube} disabled={!isLoaded}>
          Youtube
        </button>
      ) : (
        <>
          <form onSubmit={onSubmitSearch}>
            <input
              type='text'
              name='term'
              value={term}
              onChange={e => setTerm(e.target.value)}
            />
          </form>

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
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </span>
  )
}
