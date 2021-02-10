import {SpotifyCommon} from './spotifyCommon'

export namespace SpotifyUser {
  interface UserResponse {
    country: string;
    /** @example 'JM Wizzler' */
    display_name: string;
    /** @example 'email@example.com' */
    email: string;
    external_url: SpotifyCommon.ExternalUrls;
    followers: UserFollowers;
    /** @example 'https://api.spotify.com/v1/users/wizzler' */
    href: string;
    /** @example 'wizzler' */
    id: string;
    images: SpotifyCommon.Image[];
    /** @example 'premium' */
    product: string;
    /** @example 'user' */
    type: string;
    /** @example 'spotify:user:wizzler' */
    url: string;
  }

  interface UserFollowers {
    href?: string;
    total: number;
  }
}
