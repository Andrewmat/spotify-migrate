import * as React from 'react'
import {fetchUserProfile as servicefetchUserProfile} from './SpotifyService'
import {useAuth} from './auth'

/**
 * @typedef {'loading' | 'fulfilled' | 'rejected'| 'idle'} Status
 * @typedef {import('./d.ts').SpotifyUser.UserResponse} Account
 * @typedef {{status:Status, account: Account, errorMessage: string}} AccountContext
 * @typedef {import('react').Context<AccountContext>} ReactContext
 * @typedef {import('react').Dispatch<import('react').SetStateAction<AccountContext>>} ReactAccountDispatch
 */

/** @type {ReactContext} */
const ctx = React.createContext()

export function useAccount() {
  const value = React.useContext(ctx)
  if (value == null) {
    throw Error(`useAccount should only be used inside a <Provider/> component`)
  }

  return value
}
export function Provider({children}) {
  /** @type {[AccountContext, ReactAccountDispatch]} */
  const [value, dispatch] = React.useReducer(reducer, {status: 'idle'})
  const fetchAccountRef = React.useRef(fetchAccount)

  const authenticated = useAuth()

  React.useEffect(() => {
    if (
      !authenticated ||
      value.status === 'fulfilled' ||
      value.status === 'rejected'
    ) {
      return
    }
    fetchAccountRef.current(dispatch)
    fetchAccountRef.current = () => {}
  }, [authenticated, value.status])

  return <ctx.Provider value={value}>{children}</ctx.Provider>
}

async function fetchAccount(dispatch) {
  dispatch({type: 'loading'})
  try {
    const account = await servicefetchUserProfile()
    dispatch({type: 'fulfilled', payload: {account}})
  } catch (e) {
    dispatch({type: 'rejected', payload: {message: e.message}})
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'loading': {
      return {...state, status: 'loading'}
    }
    case 'fulfilled': {
      return {...state, status: 'fulfilled', account: action.payload.account}
    }
    case 'rejected': {
      return {
        ...state,
        status: 'rejected',
        errorMessage: action.payload.message,
      }
    }
    default: {
      throw Error(`Unexpected action type '${action.type}'`)
    }
  }
}
