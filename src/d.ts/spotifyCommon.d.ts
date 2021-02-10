export namespace SpotifyCommon {
  interface ExternalUrls {
    spotify?: string;
  }

  interface ExternalIds {
    isrc?: string;
    ean?: string;
    upc?: string;
  }

  interface Image {
    url: string;
    height: number;
    width: number;
  }
}
