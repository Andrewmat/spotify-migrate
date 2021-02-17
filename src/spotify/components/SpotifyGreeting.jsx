import * as React from 'react'
import styled from 'styled-components'
import {useAccount} from '@/spotify/spotifyAccount'

/**
 * @typedef {import('./account').Account} Account
 * */

export default function SpotifyGreeting() {
  const a = useAccount()
  const {status, account, errorMessage} = a

  switch (status) {
    case 'fulfilled': {
      return <GreetingAccount account={account} />
    }
    case 'rejected': {
      console.error(errorMessage)
      return (
        <span>
          There has been a mistake when retrieving your name
        </span>
      )
    }
    case 'loading':
    default: {
      return null
    }
  }
}

/** @param {{account: Account}} */
function GreetingAccount({account}) {
  return (
    <Heading>
      Hello,{' '}
      <HeadingName>{account.display_name}</HeadingName>!
    </Heading>
  )
}

const Heading = styled.h1`
  font-size: 1.2rem;
`

const HeadingName = styled.span`
  color: ${props => props.theme['accent']['bgColor']};
`
