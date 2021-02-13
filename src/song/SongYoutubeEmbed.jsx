import * as React from 'react'

/**
 * @typedef {import('@Type').GApiYoutubeResponse.GApiYoutubeResource} YoutubeResource
 */

/** @param {YoutubeResource} props */
export default function SongYoutubeEmbed(props) {
  return (
    <iframe
      title={props.snippet.title}
      width='560'
      height='315'
      src={`https://www.youtube.com/embed/${props.id.videoId}`}
      frameBorder='0'
      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
      allowFullscreen
    ></iframe>
  )
}
