import * as React from 'react'
import createCachedPromise from '@/createCachedPromise'

const cachedPromise = createCachedPromise()

interface ScriptOptions {
  globalName?: string
}

interface UseScriptReturn<GlobalProperty> {
  isLoaded: boolean
  isFailed: boolean
  globalValue?: GlobalProperty
}

interface ReducerState<GlobalProperty> {
  status: 'idle' | 'loaded' | 'failed'
  globalValue?: GlobalProperty
}
interface ReducerAction<GlobalProperty> {
  type: 'load' | 'error'
  globalObj?: GlobalProperty
  error?: unknown
}

/**
 * useScript will load a `<script>` tag
 * with the src value in the body object
 * and if the `<script>` loads into the global object
 * it can return it using the globalName option
 */
export default function useScript<GlobalProperty>(
  src: string,
  options: ScriptOptions
): UseScriptReturn<GlobalProperty> {
  const [
    {status, globalValue},
    dispatch,
  ] = React.useReducer<
    (
      state: ReducerState<GlobalProperty>,
      action: ReducerAction<GlobalProperty>
    ) => ReducerState<GlobalProperty>
  >(reducer, {
    status: 'idle',
  })

  const memoOptions = React.useMemo(
    () => ({globalName: options.globalName}),
    [options.globalName]
  )

  React.useEffect(() => {
    ;(async () => {
      try {
        const globalObj = await loadScript<GlobalProperty>(
          src,
          memoOptions
        )
        dispatch({type: 'load', globalObj})
      } catch (error) {
        dispatch({type: 'error', error})
      }
    })()
  }, [src, memoOptions])

  return React.useMemo(
    () => ({
      isLoaded: status === 'loaded',
      isFailed: status === 'failed',
      globalValue,
    }),
    [status, globalValue]
  )
}

function reducer<GlobalValue>(
  state: ReducerState<GlobalValue>,
  action: ReducerAction<GlobalValue>
): ReducerState<GlobalValue> {
  switch (action.type) {
    case 'load': {
      return {
        ...state,
        status: 'loaded',
        globalValue: action.globalObj,
      }
    }
    case 'error': {
      return {
        ...state,
        status: 'failed',
        globalValue: undefined,
      }
    }
    default: {
      throw _Error(`Unexpected action '${action.type}'`)
    }
  }
}

async function loadScript<GlobalProperty>(
  src,
  options: ScriptOptions
): Promise<GlobalProperty | undefined> {
  return cachedPromise(src, () => {
    return new Promise((resolve, reject) => {
      const scriptDOM = document.createElement('script')
      // setup <script>
      scriptDOM.async = true
      scriptDOM.src = src

      // setup resolve
      scriptDOM.onload = () => {
        if (!options.globalName) {
          resolve(undefined)
          return
        }

        const globalObj = window[options.globalName]
        if (!globalObj) {
          reject(
            _Error(
              `Global name '${options.globalName}' not found`
            )
          )
          return
        }
        // delete window[globalName]
        resolve(globalObj)
      }

      // setup reject
      scriptDOM.onerror = error => {
        scriptDOM.remove()
        reject(error)
      }

      document.body.appendChild(scriptDOM)
    })
  })
}

function _Error(message) {
  return Error(`[${useScript.name}] ${message}`)
}
