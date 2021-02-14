import * as React from 'react'
import styled from 'styled-components'
import useScript from '@/useScript'
import {
  checkSubscribed,
  rateVideo,
  searchMusicVideo,
  subscribe,
} from '@/YoutubeService'
import YoutubeVideoCard from '@/youtube/YoutubeVideoCard'
import RoundSquaredButton from '@/uikit/RoundSquaredButton'
import useQuery from '@/useQuery'
import {device} from '@/css'
import {YoutubeThemeProvider} from '@/uikit/theme'

/**
 * @typedef {typeof window.gapi} GApi
 * @typedef {import('@Type').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 * @typedef {import('react').Dispatch<import('react').SetStateAction<GApiYoutubeResource[]>>} ReactDispatchYoutubeResources
 */

export default function YoutubeSearch() {
  const {name, artist} = useQuery()
  const q = {
    name: name,
    artist: artist,
  }

  const {
    isLoaded,
    isFailed,
    globalValue,
  } = useScript('https://apis.google.com/js/api.js', {
    globalName: 'gapi',
  })

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
      const term = [q.name, q.artist]
        .map(v => `"${v}"`)
        .join(' ')
      const results = await searchMusicVideo(gapi, term, {
        maxResults: 10,
      })
      setSearchResult(results)
    })()
  }, [gapi, isLoaded, isSignedIn, q.name, q.artist])

  async function subscribeYoutube() {
    await subscribe(gapi)
    setSignedIn(true)
  }

  async function saveVideo(id) {
    await rateVideo(gapi, id, 'like')
  }
  async function unsaveVideo(id) {
    await rateVideo(gapi, id, 'none')
  }

  if (isFailed) {
    return <span>Deu erro!</span>
  }

  return (
    <YoutubeThemeProvider>
      <Container>
        {!isSignedIn ? (
          <RoundSquaredButton
            onClick={subscribeYoutube}
            disabled={!isLoaded}
          >
            {isLoaded ? 'Sign to Youtube' : '...'}
          </RoundSquaredButton>
        ) : (
          <>
            {searchResult.length > 0 && (
              <ResultList>
                {searchResult.map(result => (
                  <ResultItem key={result.id.videoId}>
                    <YoutubeVideoCard
                      {...result}
                      onSave={saveVideo}
                      onUnsave={unsaveVideo}
                    />
                  </ResultItem>
                ))}
              </ResultList>
            )}
          </>
        )}
      </Container>
    </YoutubeThemeProvider>
  )
}

const Container = styled.div`
  padding: 20px;
`
const ResultList = styled.ul`
  display: grid;
  grid-auto-flow: row;
  grid-auto-rows: 120px;
  grid-template-columns: 1fr;
  grid-gap: 10px;
  list-style: none;

  @media ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }

  @media ${device.desktop} {
    grid-template-columns: 1fr 1fr 1fr;
  }
`

const ResultItem = styled.li`
  height: 100%;
`
