import {searchSpotifyTrack} from '@/YoutubeService'
import * as React from 'react'
import styled from 'styled-components'
import SongSpotifyCard from './SongSpotifyCard'
import SongYoutubeCard from './SongYoutubeCard'
import SongYoutubeEmbed from './SongYoutubeEmbed'

/**
 * @typedef {typeof window.gapi} GApi
 * @typedef {import('@Type').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 * @typedef {import('react').Dispatch<import('react').SetStateAction<YoutubeResource[]>>} ReactDispatchYoutubeResources
 * @typedef {import('@Type').SpotifyTrack.Track} SpotifyTrack
 */

/** @param {{spotifyTrack: SpotifyTrack, gapi: GApi}} props */
export default function SongCard(props) {
  /** @type {[YoutubeResource, ReactDispatchYoutubeResource]} */
  const [selectedEmbed, setSelectedEmbed] = React.useState()

  /** @type {[YoutubeResource[], ReactDispatchYoutubeResources]} */
  const [results, setResults] = React.useState()

  if (!props.spotifyTrack) {
    return <div>Lacking required props</div>
  }

  async function searchOnYoutube() {
    const responseResults = await searchSpotifyTrack(
      props.gapi,
      props.spotifyTrack,
      {
        maxResults: 3,
        useCache: true,
      }
    )

    setResults(responseResults)
  }

  return (
    <SongContainer>
      <SongSpotifyCardContainer>
        <SongSpotifyCard
          {...props.spotifyTrack}
          onYoutubeSearch={() => searchOnYoutube()}
        />
      </SongSpotifyCardContainer>

      <SongYoutubeCardContainer>
        {results && (
          <SongYoutubeCard
            results={results}
            onAddToSave={id => {
              console.log(`Saved ${id}`)
            }}
            onShowVideo={id => {
              setSelectedEmbed(results.find(result => result.id.videoId === id))
            }}
          />
        )}
      </SongYoutubeCardContainer>
      <SongYoutubeEmbedContainer>
        {selectedEmbed && <SongYoutubeEmbed {...selectedEmbed} />}
      </SongYoutubeEmbedContainer>
    </SongContainer>
  )
}

const SongContainer = styled.div`
  display: grid;
  grid-template-areas:
    'spotify embed'
    'youtube embed';
  grid-template-rows: auto auto;
  grid-template-columns: 1fr 560px;
`
const SongSpotifyCardContainer = styled.div`
  grid-area: spotify;
`
const SongYoutubeCardContainer = styled.div`
  grid-area: youtube;
`
const SongYoutubeEmbedContainer = styled.div`
  grid-area: embed;
`
