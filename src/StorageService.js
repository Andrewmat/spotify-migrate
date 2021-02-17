import localForage from 'localforage'

/**
 * @typedef {import('@Type').SpotifyTrack.TrackItem} TrackItem
 * */

const spotifySavedTracksStore = localForage.createInstance({
  driver: [localForage.INDEXEDDB],
  name: 'spotifysavedtracks',
  storeName: 'spotifysavedtracks',
  version: 1,
  description:
    'A collection of all tracks imported from Spotify',
})

const ID_SPOTIFY_SAVED_TRACKS = 'item'

/** @returns {TrackItem[]} */
export async function getSpotifySavedTracks() {
  return await spotifySavedTracksStore.getItem(
    ID_SPOTIFY_SAVED_TRACKS
  )
}

/** @param {TrackItem[]} trackItems */
export async function setSpotifySavedTracks(trackItems) {
  return await spotifySavedTracksStore.setItem(
    ID_SPOTIFY_SAVED_TRACKS,
    trackItems
  )
}

const youtubeSearchStore = localForage.createInstance({
  driver: [localForage.INDEXEDDB],
  name: 'youtubesearchresults',
  storeName: 'youtubesearchresults',
  version: 1,
  description: 'Cache for youtube results for searches',
})

export async function getYoutubeSearchResults(term) {
  return await youtubeSearchStore.getItem(term)
}

export async function setYoutubeSearchResults(
  term,
  results
) {
  return await youtubeSearchStore.setItem(term, results)
}
