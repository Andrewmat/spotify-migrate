import * as React from 'react'
import {GApiYoutubeResponse} from '@Type'

/**
 * @typedef {import('@Type').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 */

type YoutubeVideo = GApiYoutubeResponse.GApiYoutubeResource

type Props = YoutubeVideo

export default function SongYoutubeEmbed({
  snippet,
  id,
}: Props) {
  return (
    <iframe
      title={snippet.title}
      width='560'
      height='315'
      src={`https://www.youtube.com/embed/${id.videoId}`}
      frameBorder='0'
      allow={allowedResources}
      allowFullScreen
    ></iframe>
  )
}

const allowedResources = [
  'accelerometer',
  'autoplay',
  'clipboard-write',
  'encrypted-media',
  'gyroscope',
  'picture-in-picture',
].join('; ')
