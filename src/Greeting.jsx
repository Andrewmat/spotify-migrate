import * as React from 'react'
import {useAccount} from './account'

/**
 * @typedef {import('./account').Account} Account
 * */

export default function Greeting() {
  const a = useAccount()
  const {status, account, errorMessage} = a

  switch (status) {
    case 'fulfilled': {
      return <GreetingAccount account={account} />
    }
    case 'rejected': {
      console.error(errorMessage)
      return <span>Houve um erro ao tentar carregar seu nome</span>
    }
    case 'loading':
    default: {
      return null
    }
  }
}

/** @param {{account: Account}} */
function GreetingAccount({account}) {
  return <h2>Olá, {account.display_name}!</h2>
}
