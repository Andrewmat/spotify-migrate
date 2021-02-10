import * as React from 'react'
import styled from 'styled-components'
import Button from './styled/Button'
import Join from './Join'
import {device, textEllipsis} from './css'

/**
 * @typedef {import('./d.ts').SpotifyTrack.Track} Track
 * @typedef {import('react').MutableRefObject<HTMLAudioElement>} AudioRef
 */

/** @param {Track} props */
export default function SpotifyTrackCard(props) {
  const {album, artists, name, external_urls, preview_url} = props

  const [isPlaying, setIsPlaying] = React.useState(false)

  /** @type {AudioRef} */
  const audioRef = React.useRef()

  const image = React.useMemo(
    () =>
      album.images.reduce((minImg, currImg) => {
        if (!minImg) {
          return currImg
        }
        if (currImg.height < minImg.height) {
          return currImg
        }
        return minImg
      }),
    [album.images]
  )

  return (
    <TrackCard>
      <TrackImgContainer>
        <TrackImg
          height={image.height}
          width={image.width}
          src={image.url}
          alt={`${album.name} - Album`}
          loading='lazy'
        />
      </TrackImgContainer>
      {external_urls.spotify && (
        <TrackLink
          href={external_urls.spotify}
          target='_blank'
          rel='noreferrer'
          title={name}
        >
          {name}
        </TrackLink>
      )}
      <CardArtists>
        by{' '}
        <Join separator={<Separator>•</Separator>}>
          {artists.map(artist => (
            <LinkArtist
              key={artist.id}
              href={artist.external_urls.spotify}
              target='_blank'
              rel='noreferrer'
            >
              {artist.name}
            </LinkArtist>
          ))}
        </Join>
      </CardArtists>
      <PreviewContainer>
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <audio src={preview_url} ref={audioRef} loop />
        <Button
          theme={preview_url != null ? 'primary' : 'neutral'}
          disabled={preview_url == null}
          title={preview_url == null && 'Song without preview'}
          onClick={() => {
            if (isPlaying) {
              audioRef.current.pause()
              setIsPlaying(false)
            } else {
              audioRef.current.play()
              setIsPlaying(true)
            }
          }}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
      </PreviewContainer>
    </TrackCard>
  )
}

const TrackCard = styled.div`
  display: grid;
  grid-template-areas:
    'title preview'
    'artist preview';
  grid-template-rows: auto auto;
  grid-template-columns: 1fr auto;
  grid-gap: 10px;
  height: 64px;
  font-size: 10px;
  padding: 8px;
  border-radius: var(--radius-sm);
  border: var(--border) solid 1px;
  content-visibility: auto;
  contain-intrinsic-size: 100px;

  @media ${device.mobileL} {
    grid-template-areas:
      'img title preview'
      'img artist preview';

    grid-template-columns: 48px 1fr auto;
    font-size: 12px;
    padding: 12px;
  }

  @media ${device.tablet} {
    grid-template-columns: 64px 1fr auto;
    font-size: 14px;
    padding: 16px;
  }
`

const TrackImgContainer = styled.div`
  grid-area: img;
  display: none;
  flex-flow: column nowrap;
  justify-content: center;

  @media ${device.mobileL} {
    display: flex;
  }
`

const TrackImg = styled.img`
  width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
`
const TrackLink = styled.a`
  grid-area: title;
  font-size: 1.2em;
  color: var(--fg-base);
  text-decoration: none;
  display: inline-block;
  min-width: 0;
  font-weight: bold;

  ${textEllipsis}

  :hover {
    text-decoration: underline;
  }
`

const CardArtists = styled.div`
  grid-area: artist;
  color: var(--fg-light);
  min-width: 0;

  ${textEllipsis}
`

const LinkArtist = styled.a`
  display: inline-block;
  text-decoration: none;
  color: var(--fg-base);

  :hover {
    text-decoration: underline;
  }
`

const PreviewContainer = styled.div`
  grid-area: preview;
`

const Separator = styled.span`
  display: inline-block;
  margin: 5px;
`