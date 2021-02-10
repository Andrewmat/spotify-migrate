import {GApiYoutube} from './googleYoutube'
import {GApiAuth2} from './googleAuth'

export * from './googleYoutube';
export * from './googleAuth';

export namespace GoogleApi {
  interface GApi {
    load: (apiName: ApiName, callback: () => void) => void;
    client: GApiClient;
    auth2: GApiAuth2.GApiAuth;
  }

  interface GApiClient {
    setApiKey: (apiKey: string) => void;
    load: (apiUrl: ApiUrl) => Promise<void>;
    youtube?: GApiYoutube.GApiYoutubeClient;
  }

  type ApiUrl = 'https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest';
  
  /** @example 'client:auth2' */
  type ApiName = string;
}
