import * as CookieService from './CookieService'

const COOKIE_SPOTIFY_ACCESS_TOKEN = 'spotify_access_token'

/**
 * @typedef {import('./d.ts').SpotifyTrack.SavedTracksResponse} SavedTracksResponse
 * @typedef {import('./d.ts').SpotifyTrack.TrackItem} TrackItem
 * @typedef {import('./d.ts').SpotifyUser.UserResponse} UserResponse
 */

/** @returns {TrackItem[]} */
export async function getUserSavedTracks(
  onProgress,
  pageSize = 50,
  limitPages = Infinity
) {
  let page = 0
  let collected = []
  let total
  let requestPool = []

  do {
    if (total === undefined) {
      const response = await getUserSavedTracksPage(page, pageSize)
      ;({total} = response)
      collected.push(...response.items)
      onProgress(response.items, collected, total)
      page++
    } else {
      requestPool.push(
        getUserSavedTracksPage(page, pageSize).then(response => {
          const {total} = response
          collected.push(...response.items)
          onProgress(response.items, total)
        })
      )
      page++
    }
  } while (page * pageSize < total && page < limitPages)

  await Promise.all(requestPool)

  return collected
}

/** @returns {UserResponse} */
export async function getUserProfile() {
  try {
    const response = await get('/v1/me')

    if (!response.ok) {
      throw response
    }

    return await response.json()
  } catch (e) {
    console.error(e)
    throw e
  }
}

/** @returns {SavedTracksResponse} */
async function getUserSavedTracksPage(page, pageSize = 50) {
  const response = await treatRateLimit(
    get('/v1/me/tracks', {
      offset: page * pageSize,
      limit: pageSize,
    }),
    () => getUserSavedTracksPage(page, pageSize)
  )
  if (!response.ok) {
    throw response
  }
  return await response.json()
}

/** @param {Promise<Request>} promise, @param {() => Promise<Request>} retryFn @returns {Promise<Request>} */
async function treatRateLimit(promise, retryFn, limitMs = 30000) {
  const response = await promise
  if (response.status !== 429) {
    return response
  }

  const retryAfterHeader = response.headers.get('Retry-After')
  let retryAfterMs = Number(retryAfterHeader) * 1000

  if (!retryAfterMs) {
    retryAfterMs = 5000
    console.warn(
      `Header 'Retry-After' is invalid. Value ${retryAfterHeader}. Using 5 seconds instead`
    )
  }

  if (retryAfterMs > limitMs) {
    return response
  }

  return new Promise((resolve, reject) => {
    return setTimeout(() => {
      return retryFn().then(resolve, reject)
    }, retryAfterMs)
  })
}

function get(endpoint, params, {body} = {}) {
  const accessToken = CookieService.getCookie(COOKIE_SPOTIFY_ACCESS_TOKEN)
  return fetch(getUrl(endpoint, params), {
    body,
    method: 'GET',
    headers: {
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
    },
  })
}

function getUrl(endpoint, params = {}) {
  const url = new URL(`https://api.spotify.com${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return String(url)
}
