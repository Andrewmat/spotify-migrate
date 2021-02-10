import * as React from 'react'
import {getVar} from './EnvService'
import useScript from './useScript'

/**
 * @typedef {import('./d.ts').GoogleApi.GApi} GApi
 * @typedef {import('./d.ts').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 * @typedef {import('react').Dispatch<import('react').SetStateAction<GApiYoutubeResource[]>>} ReactDispatchYoutubeResources
 */

export default function useAuthYoutube() {
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
    if (!isLoaded) {
      return
    }

    ;(async () => {
      await new Promise(resolve => gapi.load('client:auth2', resolve))
      console.log('load successful')
      await gapi.auth2.init({client_id: getVar('YOUTUBE_CLIENT_ID')})
      console.log('auth init successful')
    })()
  }, [isLoaded, gapi])

  async function subscribeYoutube() {
    await gapi.auth2
      .getAuthInstance()
      .signIn({scope: 'https://www.googleapis.com/auth/youtube.force-ssl'})
    console.log('auth signin successful')

    gapi.client.setApiKey(getVar('YOUTUBE_API_KEY'))
    await gapi.client.load(
      'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
    )
    console.log('client load successful')
    setSignedIn(true)
  }

  /** @param {Event} e */
  async function onSubmitSearch(e) {
    e.preventDefault()
    const response = await gapi.client.youtube.search.list({
      part: ['snippet'],
      q: term,
      videoCategoryId: 10,
      type: 'video',
    })

    setSearchResult(response.result.items)
  }

  if (isFailed) {
    return <span>Deu erro!</span>
  }

  return (
    <span>
      Deu sucesso!
      {!isSignedIn ? (
        <button onClick={subscribeYoutube}>Youtube</button>
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
                <li>
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
