import * as React from 'react'
import createCachedPromise from '@/createCachedPromise'

const cachedPromise = createCachedPromise()

/**
 * useScript will load a <script> tag
 * with the src value in the body object
 * and if the <script> loads into the global object
 * it can clear it up using the globalName option
 * @template GlobalType
 * @param {string} src
 * @param {{ globalName: string }} options
 * @returns {{isLoaded: boolean, isFailed: boolean, globalValue: GlobalType}}
 */
export default function useScript(src, options) {
  const [
    {status, globalValue},
    dispatch,
  ] = React.useReducer(reducer, {
    status: 'idle',
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoOptions = React.useMemo(() => options, [
    options.globalName,
  ])

  React.useEffect(() => {
    ;(async () => {
      try {
        const globalObj = await loadScript(src, memoOptions)
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

function reducer(state, action) {
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

async function loadScript(src, options = {}) {
  return cachedPromise(src, () => {
    return new Promise((resolve, reject) => {
      const scriptDOM = document.createElement('script')
      // setup <script>
      scriptDOM.async = true
      scriptDOM.src = src

      // setup resolve
      scriptDOM.onload = () => {
        if (!options.globalName) {
          resolve()
          return
        }

        const {globalName} = options

        const globalObj = window[globalName]
        if (!globalObj) {
          reject(
            _Error(`Global name '${globalName}' not found`)
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
