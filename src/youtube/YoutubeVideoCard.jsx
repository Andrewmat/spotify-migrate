import * as React from 'react'
import styled from 'styled-components'
import {device, textEllipsis} from '@/css'
import RoundSquaredButton from '@/uikit/RoundSquaredButton'
import useStateWithTransition from './useStateWithTransition'

/**
 * @typedef {import('../d.ts/index').GApiYoutubeResponse.GApiYoutubeResource} YoutubeVideo
 * @typedef {YoutubeVideo & {
 *   onSave(id: string): Promise<void>,
 *   onUnsave(id: string): Promise<void>,
 * }} ComponentProps
 * */

/** @param {ComponentProps} props */
export default function YoutubeVideoCard(props) {
  const {
    id: {videoId},
    snippet,
    onSave,
    onUnsave,
  } = props

  const [isSaved, setSaved, isChangingSaved] = useStateWithTransition(
    false,
    2000
  )
  const image =
    snippet.thumbnails.default ??
    snippet.thumbnails.medium ??
    snippet.thumbnails.standard

  async function handleToggleSaveVideo() {
    if (isSaved) {
      await onUnsave(videoId)
      setSaved(false)
    } else {
      await onSave(videoId)
      setSaved(true)
    }
  }

  const buttonLabel = React.useMemo(() => {
    if (isSaved && !isChangingSaved) {
      return 'Unsave'
    }

    if (!isSaved && isChangingSaved) {
      return 'Saved!'
    }

    return 'Save'
  }, [isChangingSaved, isSaved])

  return (
    <YoutubeCard>
      <YoutubeThumbContainer>
        <YoutubeThumbImg
          src={image.url}
          alt={snippet.title}
          height={image.height}
          width={image.width}
        />
      </YoutubeThumbContainer>
      <YoutubeTitle href={`https://www.youtube.com/watch?v=${videoId}`}>
        {snippet.title}
      </YoutubeTitle>
      <YoutubeChannel
        href={`https://www.youtube.com/user/${snippet.channelId}`}
      >
        {snippet.channelTitle}
      </YoutubeChannel>
      <YoutubeAction>
        <RoundSquaredButton onClick={handleToggleSaveVideo}>
          {buttonLabel}
        </RoundSquaredButton>
      </YoutubeAction>
    </YoutubeCard>
  )
}

const YoutubeCard = styled.div`
  display: grid;
  border: var(--border) solid 1px;
  color: #212121;
  grid-template-areas:
    'title'
    'channel'
    'like';
  grid-template-rows: auto auto auto;
  grid-template-columns: 1fr;
  grid-gap: 5px;
  border-radius: var(--radius-sm);
  padding: 10px;
  height: 100%;
  font-size: 12px;

  @media ${device.mobileL} {
    grid-template-areas:
      'thumb title'
      'thumb channel'
      'thumb .'
      'thumb like';

    grid-template-columns: 60px 1fr;
    font-size: 13px;
  }

  @media ${device.tablet} {
    grid-template-columns: 100px 1fr;
  }

  @media ${device.desktop} {
    grid-template-columns: 120px 1fr;
    font-size: 14px;
  }
`

const YoutubeThumbContainer = styled.div`
  display: none;
  grid-area: thumb;
  flex-flow: nowrap column;
  justify-content: center;

  @media ${device.mobileL} {
    display: flex;
  }
`

const YoutubeThumbImg = styled.img`
  width: 100%;
  height: auto;
`

const YoutubeTitle = styled.a`
  grid-area: title;
  font-size: 1em;

  ${textEllipsis}
`

const YoutubeChannel = styled.a`
  grid-area: channel;
  font-size: 0.9em;
  color: #555555;
`
const YoutubeAction = styled.div`
  grid-area: like;
  display: flex;
  justify-content: flex-end;
`
