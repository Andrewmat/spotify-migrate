import {SpotifyCommon} from './spotifyCommon'

export namespace SpotifyTrack {
  interface SavedTracksResponse {
    href: string
    items: TrackItem[]
    limit: number
    /** @example 'https://api.spotify.com/v1/me/tracks?offset=20&limit=20' */
    next: string
    offset: number
    /** @example 'https://api.spotify.com/v1/me/tracks?offset=20&limit=20' */
    previous: string
    total: number
  }

  interface TrackItem {
    track: Track
    added_at: string
  }

  interface Track {
    album: Album
    artists: Artist[]
    duration_ms: number
    disc_number: number
    external_ids: SpotifyCommon.ExternalIds
    external_urls: SpotifyCommon.ExternalUrls
    /** @example 'https://api.spotify.com/v1/tracks/2jpDioAB9tlYXMdXDK3BGl' */
    href: string
    /** @example '2jpDioAB9tlYXMdXDK3BGl' */
    id: string
    /** @example 'Good Enough For Granddad' */
    name: string
    /** @example 19 */
    popularity: number
    /** @example 'https://p.scdn.co/mp3-preview/32cc6f7a3fca362dfcde753f0339f42539f15c9a' */
    preview_url: string
    /** @example 1 */
    track_number: number
    /** @example 'track' */
    type: string
    /** @example 'spotify:track:2jpDioAB9tlYXMdXDK3BGl' */
    uri: string
  }

  interface Album {
    /** @example 'album' */
    album_type: string
    artists: Artist[]
    external_urls: SpotifyCommon.ExternalUrls
    /** @example 'https://api.spotify.com/v1/albums/63GBbuUNBel2ovJjUrfh5r' */
    href: string
    /** @example '63GBbuUNBel2ovJjUrfh5r' */
    id: string
    images: SpotifyCommon.Image[]
    /** @example 'The Best of Squirrel Nut Zippers' */
    name: string
    /** @example 'album' */
    type: string
    /** @example 'spotify:album:63GBbuUNBel2ovJjUrfh5r' */
    uri: string
  }

  interface Artist {
    external_urls: SpotifyCommon.ExternalUrls
    /** @example 'https://api.spotify.com/v1/artists/0LIll5i3kwo5A3IDpipgkS' */
    href: string
    /** @example '0LIll5i3kwo5A3IDpipgkS' */
    id: string
    /** @example 'Squirrel Nut Zippers' */
    name: string
    /** @example 'artist' */
    type: string
    /** @example 'spotify:artist:0LIll5i3kwo5A3IDpipgkS' */
    uri: string
  }
}
