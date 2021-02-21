import * as React from 'react'
import styled from 'styled-components'
import {device} from '@/css'
import SpotifyTrackCard from './SpotifyTrackCard'
import {SpotifyTrack} from '@Type'

interface Props {
  tracks?: SpotifyTrack.TrackItem[]
}

export default function SpotifyImporterTrackList({
  tracks,
}: Props) {
  return tracks && tracks.length ? (
    <TrackList>
      {tracks.filter(Boolean).map(({track}) => (
        <TrackItem key={track.id}>
          <SpotifyTrackCard {...track} showYoutubeLink />
        </TrackItem>
      ))}
    </TrackList>
  ) : null
}

const TrackList = styled.ul`
  display: grid;
  grid-auto-rows: auto;
  grid-template-columns: 1fr;
  list-style: none;
  grid-gap: 8px;
  margin: auto;
  max-width: 1326px;

  @media ${device.tablet} {
    grid-template-columns: 1fr 1fr;
  }
`

const TrackItem = styled.li``
