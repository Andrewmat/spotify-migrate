import {SpotifyTrack} from '@Type'

type Track = SpotifyTrack.Track

type TrackArtistField =
  | 'artist.id'
  | 'artist.name'
  | 'artist.url'

type TrackAlbumField =
  | 'album.id'
  | 'album.name'
  | 'album.url'
  | 'album.artist.id'
  | 'album.artist.name'
  | 'album.artist.url'

type TrackGeneralField =
  | 'id'
  | 'name'
  | 'duration'
  | 'url'
  | 'popularity'
  | 'previewUrl'
  | 'trackNumber'

type TrackCsvField =
  | TrackArtistField
  | TrackAlbumField
  | TrackGeneralField

export function tracksAsCsv(
  trackItems: SpotifyTrack.TrackItem[],
  fields: TrackCsvField[]
) {
  const tracks = formatTracks(trackItems, fields)
  const header = fields.join(',')
  const lines: string[] = []
  for (const track of tracks) {
    const line = []
    for (const field of fields) {
      line.push(track[field])
    }
    lines.push(line.join(','))
  }

  return [header].concat(lines).join('\n')
}
function formatTracks(
  trackItems: SpotifyTrack.TrackItem[],
  fields: TrackCsvField[]
) {
  const formattedTracks: Partial<
    Record<TrackCsvField, string>
  >[] = []
  for (const trackItem of trackItems) {
    formattedTracks.push(
      formatTrack(trackItem.track, fields)
    )
  }
  return formattedTracks
}

function formatTrack(
  track: Track,
  fields: TrackCsvField[]
) {
  const obj: Partial<Record<TrackCsvField, string>> = {}
  for (const field of fields) {
    obj[field] = getTrackField(track, field)
  }
  return obj
}

function getTrackField(
  track: Track,
  field: TrackCsvField
): string | undefined {
  switch (field) {
    case 'album.id': {
      return treatString(track.album.id)
    }
    case 'album.name': {
      return treatString(track.album.name)
    }
    case 'album.url': {
      return treatString(track.album.external_urls.spotify)
    }
    case 'album.artist.id': {
      return treatString(
        arrayField(track.album.artists, artist => artist.id)
      )
    }
    case 'album.artist.name': {
      return treatString(
        arrayField(
          track.album.artists,
          artist => artist.name
        )
      )
    }
    case 'album.artist.url': {
      return treatString(
        arrayField(
          track.album.artists,
          artist => artist.external_urls.spotify
        )
      )
    }
    case 'artist.id': {
      return treatString(
        arrayField(track.artists, artist => artist.id)
      )
    }
    case 'artist.name': {
      return treatString(
        arrayField(track.artists, artist => artist.name)
      )
    }
    case 'artist.url': {
      return treatString(
        arrayField(
          track.artists,
          artist => artist.external_urls.spotify
        )
      )
    }
    case 'id': {
      return treatString(track.id)
    }
    case 'name': {
      return treatString(track.name)
    }
    case 'duration': {
      return treatString(
        friendlyDuration(track.duration_ms)
      )
    }
    case 'url': {
      return treatString(track.external_urls.spotify)
    }
    case 'popularity': {
      return treatString(String(track.popularity))
    }
    case 'previewUrl': {
      return treatString(track.preview_url)
    }
    case 'trackNumber': {
      return treatString(String(track.track_number))
    }
    default: {
      throw Error(`Unexpected field '${field}'`)
    }
  }
}

function treatString(str: string) {
  if (!str.includes(',') && !str.includes('#')) {
    return str
  }

  if (!str.includes('"')) {
    return `"${str}"`
  }

  return `${str.replace(/"/g, '""')}`
}

function arrayField<Type>(
  arr: Type[],
  mapCallback: (item: Type) => string
): string {
  return arr.map(item => mapCallback(item)).join(', ')
}

function friendlyDuration(durationMs: number): string {
  const SECOND = 1000
  const MINUTE = 60 * SECOND
  const friendlyMinutes = Math.floor(durationMs / MINUTE)
  durationMs -= friendlyMinutes * MINUTE
  const friendlySeconds = Math.floor(durationMs / SECOND)
  durationMs -= friendlySeconds * SECOND

  return `${friendlyMinutes}:${friendlySeconds
    .toString()
    .padStart(2, '0')}`
}
