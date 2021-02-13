import * as React from 'react'
import styled from 'styled-components'

/**
 * @typedef {import('../d.ts/index').GApiYoutubeResponse.GApiYoutubeResource} YoutubeVideo
 * */

/**
 * @param {{
 *   results: YoutubeVideo[],
 *   onAddToSave(id: string): Promise<void>,
 *   onShowVideo(id: string): void,
 * }} props
 * */
export default function SongYoutubeCard(props) {
  const {results, onAddToSave, onShowVideo} = props
  return (
    <YoutubeContainer>
      <YoutubeResultList>
        {results.map(result => (
          <YoutubeResultListItem>
            <SongYoutubeCardResult
              key={result.id.videoId}
              {...result}
              onAddToSave={() => onAddToSave(result.id.videoId)}
              onShowVideo={() => onShowVideo(result.id.videoId)}
            />
          </YoutubeResultListItem>
        ))}
      </YoutubeResultList>
    </YoutubeContainer>
  )
}

/**
 * @param {YoutubeVideo & {
 *   onAddToSave(): Promise<void>,
 *   onShowVideo(): Promise<void>,
 * }} props
 * */
function SongYoutubeCardResult(props) {
  const {snippet, onAddToSave, onShowVideo} = props

  const image =
    snippet.thumbnails.default ??
    snippet.thumbnails.medium ??
    snippet.thumbnails.standard ??
    snippet.thumbnails.high ??
    snippet.thumbnails.maxres

  return (
    <SongYoutubeCardResultContainer>
      <YoutubeThumbnailContainer>
        <YoutubeThumbnailImg
          src={image.url}
          width={image.width}
          height={image.height}
        />
      </YoutubeThumbnailContainer>

      <YoutubeTextContainer>
        <YoutubeTitle>{snippet.title}</YoutubeTitle>
        <YoutubeChannel>{snippet.channelTitle}</YoutubeChannel>
        <YoutubeDescription>
          {snippet.description.split('\n').map(line => (
            <p>{line}</p>
          ))}
        </YoutubeDescription>
      </YoutubeTextContainer>

      <YoutubeInteractiveContainer>
        <YoutubeShowEmbedButton
          onClick={() => {
            console.log('show video', props.id.videoId)
            onShowVideo()
          }}
        >
          Show video
        </YoutubeShowEmbedButton>
        <YoutubeAddToSavedButton onClick={() => onAddToSave()}>
          Save on playlist
        </YoutubeAddToSavedButton>
      </YoutubeInteractiveContainer>
    </SongYoutubeCardResultContainer>
  )
}

const YoutubeContainer = styled.div``
const YoutubeResultList = styled.ul``
const YoutubeResultListItem = styled.li``

const SongYoutubeCardResultContainer = styled.div`
  display: grid;
  grid-template-areas: 'thumb text interactive';
`
const YoutubeThumbnailContainer = styled.div`
  grid-area: thumb;
`
const YoutubeThumbnailImg = styled.img``

const YoutubeTextContainer = styled.div`
  grid-area: text;
`
const YoutubeTitle = styled.span``
const YoutubeChannel = styled.span``
const YoutubeDescription = styled.span``

const YoutubeInteractiveContainer = styled.div`
  grid-area: interactive;
`
const YoutubeShowEmbedButton = styled.button``
const YoutubeAddToSavedButton = styled.button``
