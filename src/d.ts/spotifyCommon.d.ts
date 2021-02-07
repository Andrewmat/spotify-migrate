export namespace SpotifyCommon {
  type ExternalUrls = Record<'spotify', string>
  type ExternalIds = Record<'isrc', string>

  interface Image {
    url: string;
    height: number;
    width: number;
  }
}
