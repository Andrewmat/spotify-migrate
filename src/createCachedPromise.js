/**
 * cached promise receives an async function
 * and a id of the function
 * if the cached promise is called multiple times
 * with the same id, it will only call the async function
 * once and resolve all its calls with its value
 */
export default function createCachedPromise() {
  const loading = []
  const loaded = new Map()
  let listeners = []

  /**
   * @param {unknown} id
   * @template {Promise} P
   * @param {(...args: unknown) => P} asyncFunc
   * @returns {P}
   * */
  async function cachedPromise(id, asyncFunc) {
    const promise = onStart(id)
    if (promise) {
      return promise
    }
    try {
      const response = await asyncFunc()
      onResolve(id, response)
      return response
    } catch (error) {
      onReject(id, error)
      throw error
    }
  }

  function onStart(id) {
    if (loaded.has(id)) {
      // if it is already loaded, return success
      return Promise.resolve(loaded.get(id))
    }
    if (loading.includes(id)) {
      // if it is loading, adds a new listener
      // so it can be resolved when it finishes
      return new Promise((resolve, reject) => {
        listeners.push({id, resolve, reject})
      })
    }
    // if not loaded or not loading
    // starts the loading process
    loading.push(id)
    return undefined
  }

  function onResolve(id, value) {
    // adds to loaded map
    loaded.set(id, value)
    // removes from loading array
    const index = loading.findIndex(l => l === id)
    loading.splice(index, 1)

    publish(id, listener => () => listener.resolve(value))
  }

  function onReject(id, error) {
    // removes from loading array
    const index = loading.findIndex(val => val === id)
    loading.splice(index, 1)

    publish(id, listener => () => listener.reject(error))
  }

  function publish(id, getResultCallback) {
    listeners
      .filter(listener => listener.id === id)
      .map(getResultCallback)
      .forEach(callback => callback())

    // clear
    listeners = listeners.filter(listener => listener.id !== id)
  }

  return cachedPromise
}
