import {getVar} from './EnvService'

/**
 * @typedef {import('./d.ts').GoogleApi.GApi} GApi
 * @typedef {import('./d.ts').GApiAuth2.GApiAuthInstance} GApiAuthInstance
 * */

/** @param {GApi} gapi, @returns {Promise<boolean>} */
export async function checkSubscribed(gapi, ...scopes) {
  scopes = scopes || ['https://www.googleapis.com/auth/youtube.force-ssl']
  const scope = scopes.join(' ')
  await loadLibs(gapi, 'auth2', 'client')
  const authInstance = await getAuthInstance(gapi)

  if (!authInstance.isSignedIn.get()) {
    return false
  }
  return authInstance.currentUser.get().hasGrantedScopes(scope)
}

/** @param {GApi} gapi, @returns {Promise<void>} */
export async function subscribe(gapi, ...scopes) {
  scopes = scopes || ['https://www.googleapis.com/auth/youtube.force-ssl']
  const scope = scopes.join(' ')
  await loadLibs(gapi, 'auth2', 'client')
  const authInstance = await getAuthInstance(gapi)

  // if there is not a user, grant permission
  if (!authInstance.isSignedIn.get()) {
    await authInstance.signIn({scope})
    return
  }

  // if there is a user, check scope
  const currentUser = authInstance.currentUser.get()
  if (currentUser.hasGrantedScopes(scope)) {
    return
  }

  await currentUser.grant({scope})
}

/** @param {GApi} gapi @param {string} term */
export async function searchMusicVideo(gapi, term) {
  await loadLibs(gapi, 'auth2', 'client')
  gapi.client.setApiKey(getVar('GOOGLE_API_KEY'))
  await loadYoutubeApi(gapi)

  const response = await gapi.client.youtube.search.list({
    part: ['snippet'],
    q: term,
    videoCategoryId: 10,
    type: 'video',
  })
  return response.result.items
}

/** @param {GApi} gapi @param {string} videoId @param {'none' | 'like' | 'dislike'} rating */
export async function rateVideo(gapi, videoId, rating) {
  await loadLibs(gapi, 'auth2', 'client')
  gapi.client.setApiKey(getVar('GOOGLE_API_KEY'))
  await loadYoutubeApi(gapi)
  await gapi.client.youtube.videos.rate({
    id: videoId,
    rating,
  })
}

/** @param {GApi} gapi @returns {Promise<GApiAuthInstance>} */
async function getAuthInstance(gapi) {
  let instance = gapi.auth2.getAuthInstance()
  if (!instance) {
    await gapi.auth2.init({client_id: getVar('GOOGLE_CLIENT_ID')})
    instance = gapi.auth2.getAuthInstance()
  }
  return instance
}

/** @param {GApi} gapi @returns {Promise<void>} */
async function loadYoutubeApi(gapi) {
  await loadLibs(gapi, 'client')
  if (gapi.client.youtube) {
    return
  }
  await gapi.client.load(
    'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'
  )
}

/** @param {GApi} gapi @returns {Promise<void>} */
async function loadLibs(gapi, ...libs) {
  const notInitLibs = libs.filter(libName => {
    if (gapi[libName]) {
      // lib is already loaded
      return false
    }
    return true
  })

  if (notInitLibs.length === 0) {
    return
  }

  console.log(`loading libs '${notInitLibs.join(':')}'`)
  await new Promise(resolve => gapi.load(notInitLibs.join(':'), resolve))
}