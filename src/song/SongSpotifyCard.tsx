import Join from '@/Join'
import RoundButton from '@/uikit/RoundButton'
import RoundSquaredButton from '@/uikit/RoundSquaredButton'
import {
  SpotifyThemeProvider,
  youtubeTheme,
} from '@/uikit/theme'
import * as React from 'react'
import styled from 'styled-components'
import {SpotifyTrack} from '@Type'

interface Props extends SpotifyTrack.Track {
  onYoutubeSearch(): void
}

export default function SongSpotifyCard({
  album,
  artists,
  name,
  external_urls,
  preview_url,
  onYoutubeSearch,
}: Props) {
  const [isPlaying, setIsPlaying] = React.useState(false)

  const audioRef = React.useRef<HTMLAudioElement>()

  function togglePreview() {
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  function searchYoutube() {
    onYoutubeSearch()
  }

  const image = album.images.reduce(
    (minImage, currImage) => {
      if (!minImage) {
        return currImage
      }
      if (currImage.height < minImage.height) {
        return currImage
      }
      return minImage
    }
  )

  return (
    <SpotifyThemeProvider>
      <Container>
        <ImgContainer>
          <Img
            src={image.url}
            height={image.height}
            width={image.width}
            alt={`${album.name} - Album`}
          />
        </ImgContainer>

        <TextContainer>
          <TitleContainer>
            {external_urls.spotify ? (
              <TitleLink href={external_urls.spotify}>
                {name}
              </TitleLink>
            ) : (
              <Title>{name}</Title>
            )}
          </TitleContainer>
          <ArtistList>
            <Join
              separator={
                <ArtistSeparator>•</ArtistSeparator>
              }
            >
              {artists.map(artist => (
                <ArtistListItem>
                  <ArtistLink
                    href={artist.external_urls.spotify}
                  >
                    {artist.name}
                  </ArtistLink>
                </ArtistListItem>
              ))}
            </Join>
          </ArtistList>
          <Album>
            <AlbumLink href={album.external_urls.spotify}>
              {album.name}
            </AlbumLink>
          </Album>
        </TextContainer>

        <InteractiveContainer>
          {preview_url && (
            // eslint-disable-next-line jsx-a11y/media-has-caption
            <audio src={preview_url} loop ref={audioRef} />
          )}
          <PreviewButton
            variant='accent'
            onClick={() => togglePreview()}
            disabled={!preview_url}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </PreviewButton>
          <SearchYoutubeButton
            theme={youtubeTheme}
            variant='accent'
            onClick={() => searchYoutube()}
          >
            Search
          </SearchYoutubeButton>
        </InteractiveContainer>
      </Container>
    </SpotifyThemeProvider>
  )
}

const Container = styled.div`
  display: grid;
  grid-template-areas: 'img text interactive';
`
const ImgContainer = styled.div`
  grid-area: img;
`
const Img = styled.img``

const TextContainer = styled.div`
  grid-area: text;
`
const TitleContainer = styled.div``
const Title = styled.span``
const TitleLink = styled.a``
const ArtistList = styled.ul`
  list-style: none;
`
const ArtistListItem = styled.li`
  display: inline-block;
`
const ArtistLink = styled.a``
const Album = styled.span``
const AlbumLink = styled.a``
const ArtistSeparator = styled.span`
  display: inline-block;
  margin: 0 5px;
`

const InteractiveContainer = styled.div`
  grid-area: interactive;
`
const PreviewButton = styled(RoundButton)``
const SearchYoutubeButton = styled(RoundSquaredButton)``
