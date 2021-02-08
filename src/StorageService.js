import localForage from 'localforage'

/**
 * @typedef {import('./d.ts').SpotifyTrack.TrackItem} SavedTracksResponse
 * */

const trackStore = localForage.createInstance({
  driver: [localForage.INDEXEDDB],
  name: 'spotifysavedtracks',
  storeName: 'spotifysavedtracks',
  version: 1,
  description: 'A collection of all tracks imported from Spotify',
})

const ID = 'item'

export async function get() {
  return await trackStore.getItem(ID)
}

/** @param {TrackItem[]} trackItems */
export async function save(trackItems) {
  return await trackStore.setItem(ID, trackItems)
}
