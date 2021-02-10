export namespace GApiAuth2 {
  interface GApiAuth {
    init: (options: GApiInitOptions) => Promise<void>;
    getAuthInstance: () => GApiAuthInstance
  }

  interface GApiAuthInstance {
    signIn: (options: GApiAuthInstanceSignInOptions) => Promise<void>;
    isSignedIn: GApiAuthInstanceIsSignedIn;
  }

  interface GApiAuthInstanceIsSignedIn {
    listen: (callback: (isSignedIn: boolean) => void) => void;
  }
  
  interface GApiInitOptions {
    client_id: string;
  }

  interface GApiAuthInstanceSignInOptions {
    scope: GApiAuthInstanceSignInYoutubeScope
  }

  type GApiAuthInstanceSignInYoutubeScope = 
    'https://www.googleapis.com/auth/youtube' |
    'https://www.googleapis.com/auth/youtube.channel-memberships.creator' |
    'https://www.googleapis.com/auth/youtube.force-ssl' |
    'https://www.googleapis.com/auth/youtube.readonly' |
    'https://www.googleapis.com/auth/youtube.upload' |
    'https://www.googleapis.com/auth/youtubepartner' |
    'https://www.googleapis.com/auth/youtubepartner-channel-audit';
}
