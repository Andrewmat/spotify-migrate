import localForage from 'localforage'

/**
 * @typedef {import('./d.ts').SpotifyTrack.SavedTracksResponse} SavedTracksResponse
 * */

const trackStore = localForage.createInstance({
  driver: [localForage.INDEXEDDB],
  name: 'spotifysavedtracks',
  storeName: 'spotifysavedtracks',
  version: 1,
  description: 'A collection of all tracks imported from Spotify',
})

export async function get(id) {
  return await trackStore.getItem(id)
}

/** @param {SavedTracksResponse} response */
export async function save(id, response) {
  return await trackStore.setItem(id, response)
}
