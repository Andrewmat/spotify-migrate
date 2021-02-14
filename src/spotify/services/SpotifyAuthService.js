import {v4 as uuid} from 'uuid'
import {getVar} from '@/EnvService'
import * as CookieService from '@/CookieService'

const COOKIE_SPOTIFY_AUTH_STATE = 'tmp_spotify_auth_state'
const COOKIE_SPOTIFY_ACCESS_TOKEN = 'spotify_access_token'

/**
 * @typedef {import('@Type').SpotifyTrack.SavedTracksResponse} SavedTracksResponse
 */

export async function getIsAuth() {
  return !!CookieService.getCookie(
    COOKIE_SPOTIFY_ACCESS_TOKEN
  )
}

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
  const requiredFields = [
    'access_token',
    'expires_in',
    'state',
  ]

  let missingFields = []
  for (const field of requiredFields) {
    if (
      !Object.prototype.hasOwnProperty.call(result, field)
    ) {
      missingFields.push(field)
    }
  }
  if (missingFields.length > 0) {
    throw Error(
      `Required field(s) ${missingFields} is(are) missing`
    )
  }

  // checking state value
  // https://developer.spotify.com/documentation/general/guides/authorization-guide/#implicit-grant-flow
  const cookieState = CookieService.getCookie(
    COOKIE_SPOTIFY_AUTH_STATE
  )
  if (cookieState !== result.state) {
    throw Error(
      `State value is invalid. Expected '${cookieState}' but got '${result.state}'`
    )
  }
  CookieService.deleteCookie(COOKIE_SPOTIFY_AUTH_STATE)

  // adding the access token into a cookie
  const expires = new Date(
    now.getTime() + result.expires_in * 1000
  )
  CookieService.setCookie(
    COOKIE_SPOTIFY_ACCESS_TOKEN,
    `${
      result.access_token
    }; expires=${expires.toGMTString()}`
  )
  return result.access_token
}

function getUrl(endpoint, params) {
  const url = new URL(
    `https://accounts.spotify.com${endpoint}`
  )
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value)
  }
  return String(url)
}
