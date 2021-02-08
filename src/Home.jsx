import * as React from 'react'
import styled from 'styled-components'
import {HasAuth} from './auth'
import SpotifyImporter from './SpotifyImporter'
import {openAuthDialog} from './SpotifyService'
import Greeting from './Greeting'
import Button from './styled/Button'

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
        <Greeting />
        <SpotifyImporter />
      </HasAuth>
    </Container>
  )
}

const Container = styled.div`
  padding: 20px;
`
