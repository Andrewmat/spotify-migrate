import * as React from 'react'
import {fetchUserProfile as servicefetchUserProfile} from '@/spotify/services/SpotifyService'
import {useAuth} from '@/spotify/components/spotifyAuth'
import {SpotifyUser} from '@Type'

type Status = 'loading' | 'fulfilled' | 'rejected' | 'idle'

interface AccountContext {
  status: Status
  account?: SpotifyUser.UserResponse
  errorMessage?: string
}

interface AccountReducerAction {
  type: 'loading' | 'fulfilled' | 'rejected'
  payload?: {
    account?: SpotifyUser.UserResponse
    message?: string
  }
}

interface AccountReducer {
  (
    state: AccountContext,
    action: AccountReducerAction
  ): AccountContext
}

const ctx = React.createContext<AccountContext | undefined>(
  undefined
)

export function useAccount() {
  const value = React.useContext(ctx)
  if (value == null) {
    throw Error(
      `useAccount should only be used inside a <Provider/> component`
    )
  }

  return value
}

export function Provider({children}) {
  const [
    value,
    dispatch,
  ] = React.useReducer<AccountReducer>(reducer, {
    status: 'idle',
  })
  const fetchAccountRef = React.useRef<
    typeof fetchAccount | (() => void)
  >(fetchAccount)

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
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    fetchAccountRef.current = () => {}
  }, [authenticated, value.status])

  return (
    <ctx.Provider value={value}>{children}</ctx.Provider>
  )
}

async function fetchAccount(
  dispatch: React.Dispatch<AccountReducerAction>
) {
  dispatch({type: 'loading'})
  try {
    const account = await servicefetchUserProfile()
    dispatch({type: 'fulfilled', payload: {account}})
  } catch (e) {
    const message = e.message ? e.message : e
    dispatch({
      type: 'rejected',
      payload: {message},
    })
  }
}

function reducer(
  state: AccountContext,
  action: AccountReducerAction
): AccountContext {
  switch (action.type) {
    case 'loading': {
      return {...state, status: 'loading'}
    }
    case 'fulfilled': {
      return {
        ...state,
        status: 'fulfilled',
        account: action.payload.account,
      }
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
