import {v4 as uuid} from 'uuid'
import {getVar} from './EnvService'
import * as CookieService from './CookieService'

const COOKIE_SPOTIFY_AUTH_STATE = 'tmp_spotify_auth_state'
const COOKIE_SPOTIFY_ACCESS_TOKEN = 'spotify_access_token'

/**
 * @typedef {import("./d.ts").SavedTracksResponse} SavedTracksResponse
 */

export function openAuthDialog(callbackPath) {
  const state = uuid()
  CookieService.setCookie(COOKIE_SPOTIFY_AUTH_STATE, state)
  const redirectUri = String(
    new URL(`${document.location.origin}${callbackPath}`)
  )

  window.location = getUrl(
    '/authorize',
    {
      client_id: getVar('SPOTIFY_CLIENT_ID'),
      response_type: 'token',
      redirect_uri: redirectUri,
      state,
      scope: 'user-library-read user-read-email',
    },
    'https://accounts.spotify.com'
  )
}

export function resolveAuthCallback(location) {
  const now = new Date()
  let hashValue = location.hash.slice(1)
  let arrHash = hashValue.split('&')

  const result = {}
  for (const strHash of arrHash) {
    const [key, value] = strHash.split('=')
    result[key] = value
  }

  // checking required values
  const requiredFields = ['access_token', 'expires_in', 'state']

  let missingFields = []
  for (const field of requiredFields) {
    if (!result.hasOwnProperty(field)) {
      missingFields.push(field)
    }
  }
  if (missingFields.length > 0) {
    throw Error(`Required field(s) ${missingFields} is(are) missing`)
  }

  // checking state value
  // https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
  const cookieState = CookieService.getCookie(COOKIE_SPOTIFY_AUTH_STATE)
  if (cookieState !== result.state) {
    throw Error(
      `State value is invalid. Expected '${cookieState}' but got '${result.state}'`
    )
  }
  CookieService.deleteCookie(COOKIE_SPOTIFY_AUTH_STATE)

  // adding the access token into a cookie
  const expires = new Date(now.getTime() + result.expires_in * 1000)
  CookieService.setCookie(
    COOKIE_SPOTIFY_ACCESS_TOKEN,
    `${result.access_token}; expires=${expires.toGMTString()}`
  )
  return result.access_token
}

export async function getIsAuth() {
  return !!CookieService.getCookie(COOKIE_SPOTIFY_ACCESS_TOKEN)
}

const DELAY_BETWEEN_REQUESTS = 2000
export async function getUserSavedTracks(
  onProgress,
  pageSize = 50,
  limitPages = Infinity
) {
  let page = 0
  let collected = []
  let response
  let total

  do {
    response = await getUserSavedTracksPaginated(page, pageSize)
    ;({total} = response)
    collected.push(...response.items)
    onProgress(response.items, collected, total)
    page++
    await new Promise(resolve => setTimeout(resolve, DELAY_BETWEEN_REQUESTS))
  } while (collected.length < total && page < limitPages)

  return collected
}

window.getUserSavedTracks = getUserSavedTracks

/** @returns {SavedTracksResponse} */
export async function getUserSavedTracksPaginated(page, pageSize = 50) {
  const response = await treatRateLimit(
    get('/v1/me/tracks', {
      offset: page * pageSize,
      limit: pageSize,
    }),
    () => getUserSavedTracksPaginated(page, pageSize)
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

function post(endpoint, body, {params} = {}) {
  const accessToken = CookieService.getCookie(COOKIE_SPOTIFY_ACCESS_TOKEN)
  return fetch(getUrl(endpoint, params), {
    body,
    method: 'POST',
    headers: {
      ...(accessToken ? {Authorization: `Bearer ${accessToken}`} : {}),
    },
  })
}

function getUrl(endpoint, params, host = 'https://api.spotify.com') {
  const url = new URL(`${host}${endpoint}`)
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return String(url)
}
