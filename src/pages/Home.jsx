import * as React from 'react'
import styled from 'styled-components'
import {HasAuth} from '@/spotify/components/spotifyAuth'
import SpotifyImporter from '@/spotify/components/SpotifyImporter'
import {openAuthDialog} from '@/spotify/services/SpotifyService'
import SpotifyGreeting from '@/spotify/components/SpotifyGreeting'
import RoundButton from '@/uikit/RoundButton'
import {SpotifyThemeProvider} from '@/uikit/theme'

export default function Home() {
  function onSubscribeClick() {
    openAuthDialog('/auth-spotify')
  }

  return (
    <SpotifyThemeProvider>
      <Container>
        <HasAuth not>
          <RoundButton
            variant='accent'
            onClick={onSubscribeClick}
          >
            Subscribe Spotify
          </RoundButton>
        </HasAuth>
        <HasAuth>
          <SpotifyGreeting />
          <SpotifyImporter />
        </HasAuth>
      </Container>
    </SpotifyThemeProvider>
  )
}

const Container = styled.div`
  padding: 20px;
`
