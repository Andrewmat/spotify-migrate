import {searchSpotifyTrack} from '@/YoutubeService'
import * as React from 'react'
import styled from 'styled-components'
import SongSpotifyCard from './SongSpotifyCard'
import SongYoutubeCard from './SongYoutubeCard'
import SongYoutubeEmbed from './SongYoutubeEmbed'
import {
  SpotifyTrack,
  GApiYoutubeResponse,
  GoogleApi,
} from '@Type'

type YoutubeVideo = GApiYoutubeResponse.GApiYoutubeResource

export default function SongCard({
  spotifyTrack,
  gapi,
}: {
  spotifyTrack: SpotifyTrack.Track
  gapi: GoogleApi.GApi
}) {
  const [
    selectedEmbed,
    setSelectedEmbed,
  ] = React.useState<YoutubeVideo>()

  const [results, setResults] = React.useState<
    YoutubeVideo[]
  >()

  if (!spotifyTrack) {
    return <div>Lacking required props</div>
  }

  async function searchOnYoutube() {
    const responseResults = await searchSpotifyTrack(
      gapi,
      spotifyTrack,
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
          {...spotifyTrack}
          onYoutubeSearch={() => searchOnYoutube()}
        />
      </SongSpotifyCardContainer>

      <SongYoutubeCardContainer>
        {results && (
          <SongYoutubeCard
            results={results}
            onAddToSave={async id => {
              console.log(`Saved ${id}`)
            }}
            onShowVideo={id => {
              setSelectedEmbed(
                results.find(
                  result => result.id.videoId === id
                )
              )
            }}
          />
        )}
      </SongYoutubeCardContainer>
      <SongYoutubeEmbedContainer>
        {selectedEmbed && (
          <SongYoutubeEmbed {...selectedEmbed} />
        )}
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
