import * as React from 'react'
import styled from 'styled-components'
import {HasAuth} from '@/spotify/components/spotifyAuth'
import SpotifyImporter from '@/spotify/components/SpotifyImporter'
import {openAuthDialog} from '@/spotify/services/SpotifyService'
import SpotifyGreeting from '@/spotify/components/SpotifyGreeting'
import Button from '@/styled/SpotifyButton'

export default function Home() {
  function onSubscribeClick() {
    openAuthDialog('/auth-spotify')
  }

  return (
    <Container>
      <HasAuth not>
        <Button onClick={onSubscribeClick}>Subscribe Spotify</Button>
      </HasAuth>
      <HasAuth>
        <SpotifyGreeting />
        <SpotifyImporter />
      </HasAuth>
    </Container>
  )
}

const Container = styled.div`
  padding: 20px;
`
