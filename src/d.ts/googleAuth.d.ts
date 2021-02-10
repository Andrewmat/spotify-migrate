export namespace GoogleApiAuth {
  interface GApiAuth {
    init(options: GApiInitOptions): Promise<void>;
    getAuthInstance(): GApiAuthInstance;
  }

  interface GApiAuthInstance {
    signIn(options: GApiAuthInstanceSignInOptions): Promise<void>;
    isSignedIn: GApiAuthInstanceIsSignedIn;
    currentUser: GApiCurrentUser;
  }

  interface GApiCurrentUser {
    get(): GoogleUser;
    listen(listener: () => void): void;
  }

  interface GoogleUser {
    getId(): string;
    isSignedIn(): boolean;
    getBasicProfile(): GoogleUserBasicProfile;
    getGrantedScopes(): string;
    hasGrantedScopes(scope: GApiAuthInstanceScope): boolean;
    grant(options: GApiAuthInstanceSignInOptions): Promise<void>;
  }

  interface GoogleUserBasicProfile {
    getId(): string;
    getName(): string;
    getGivenName(): string;
    getFamilyName(): string;
    getImageUrl(): string;
    getEmail(): string;
  }

  interface GApiAuthInstanceIsSignedIn {
    get(): boolean;
    listen(callback: (isSignedIn: boolean) => void): void;
  }
  
  interface GApiInitOptions {
    client_id: string;
  }

  interface GApiAuthInstanceSignInOptions {
    scope: GApiAuthInstanceScope
  }

  type GApiAuthInstanceScope =
    GApiAuthInstanceScopeYoutube |
    GApiAuthInstanceScopeUser;

  type GApiAuthInstanceScopeUser = 'profile' | 'email'
  
  type GApiAuthInstanceScopeYoutube = 
    'https://www.googleapis.com/auth/youtube' |
    'https://www.googleapis.com/auth/youtube.channel-memberships.creator' |
    'https://www.googleapis.com/auth/youtube.force-ssl' |
    'https://www.googleapis.com/auth/youtube.readonly' |
    'https://www.googleapis.com/auth/youtube.upload' |
    'https://www.googleapis.com/auth/youtubepartner' |
    'https://www.googleapis.com/auth/youtubepartner-channel-audit';
}
