import * as React from 'react'
import styled from 'styled-components'
import Join from './Join'

export default function SpotifyTrackCard({
  album,
  name,
  artists,
  external_urls,
}) {
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
          alt={album.name}
          loading='lazy'
        />
      </TrackImgContainer>
      <CardText>
        <div>
          <TrackLink
            className='track-link'
            href={external_urls.spotify}
            target='_blank'
            rel='noreferrer'
            title={name}
          >
            {name}
          </TrackLink>
        </div>
        <CardArtists>
          by{' '}
          <Join separator={<Separator>•</Separator>}>
            {artists.map(artist => (
              <LinkArtist
                key={artist.id}
                href={artist.external_urls.spotify}
                target='_blank'
                rel='noreferrer'
                className='link-artist'
              >
                {artist.name}
              </LinkArtist>
            ))}
          </Join>
        </CardArtists>
      </CardText>
    </TrackCard>
  )
}

const TrackCard = styled.div`
  display: flex;
  height: 64px;
  margin: 4px;
  padding: 8px;
  border-radius: 8px;
  border: #ccc solid 1px;
  width: 500px;
  content-visibility: auto;
  contain-intrinsic-size: 82px;
`

const TrackImgContainer = styled.div`
  height: 64px;
  width: 64px;
`

const TrackImg = styled.img`
  width: 100%;
  border-radius: var(--radius-sm);
`

const CardText = styled.div`
  margin-left: 10px;
`

const TrackLink = styled.a`
  font-size: 1.2em;
  color: var(--fg-base);
  text-decoration: none;
  display: inline-block;
  max-width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: bold;

  :hover {
    text-decoration: underline;
  }
`

const CardArtists = styled.div`
  color: var(--fg-light);
`

const LinkArtist = styled.a`
  display: inline-block;
  text-decoration: none;
  color: var(--fg-base);

  :hover {
    text-decoration: underline;
  }
`
const Separator = styled.span`
  display: inline-block;
  margin: 5px;
`
