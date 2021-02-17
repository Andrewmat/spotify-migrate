import * as React from 'react'

export default function useStateWithTransition(
  initialValue,
  transitionMs
) {
  const [originalState, originalSetState] = React.useState(
    initialValue
  )
  const [isTransition, setTransition] = React.useState(
    false
  )
  const timeoutRef = React.useRef()

  const finishTransition = React.useCallback(newState => {
    console.log('setTransition(false)', newState)
    setTransition(false)
    originalSetState(newState)
  }, [])

  const startTransition = React.useCallback(
    newState => {
      console.log('setTransition(true)', newState)
      setTransition(true)
      timeoutRef.current = setTimeout(() => {
        finishTransition(newState)
      }, transitionMs)
    },
    [finishTransition, transitionMs]
  )

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const state = originalState
  const setState = startTransition

  return [state, setState, isTransition]
}
