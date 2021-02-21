import * as React from 'react'
import styled from 'styled-components'
import {useAccount} from '@/spotify/spotifyAccount'
import {SpotifyUser} from '@Type'

type Account = SpotifyUser.UserResponse

export default function SpotifyGreeting() {
  const {status, account, errorMessage} = useAccount()

  React.useEffect(() => {
    if (status === 'rejected') {
      console.error(errorMessage)
    }
  }, [status, errorMessage])

  switch (status) {
    case 'fulfilled': {
      return <GreetingAccount account={account} />
    }
    case 'rejected': {
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

function GreetingAccount({account}: {account: Account}) {
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
