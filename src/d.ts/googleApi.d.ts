import {GoogleApiYoutube} from './googleYoutube'
import {GoogleApiAuth} from './googleAuth'

export {
  GoogleApiYoutube,
  GApiYoutubeResponse,
} from './googleYoutube'
export {GoogleApiAuth} from './googleAuth'

export namespace GoogleApi {
  interface GApi {
    load: (apiName: ApiName, callback: () => void) => void
    client: GApiClient
    auth2: GoogleApiAuth.GApiAuth
  }

  interface GApiClient {
    setApiKey: (apiKey: string) => void
    load: (apiUrl: ApiUrl) => Promise<void>
    youtube?: GoogleApiYoutube.GApiYoutubeClient
  }

  type ApiUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'

  /** @example 'client:auth2' */
  type ApiName = string
}

export {GoogleApi}
