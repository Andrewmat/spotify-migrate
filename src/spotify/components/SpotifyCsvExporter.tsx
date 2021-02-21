import RoundButton from '@/uikit/RoundButton'
import * as React from 'react'
import {tracksAsCsv} from '@/spotify/services/SpotifyCsvService'
import {SpotifyTrack} from '@Type'

export default function SpotifyCsvExporter({
  tracks,
}: {
  tracks: SpotifyTrack.TrackItem[]
}) {
  const csvMemo = React.useRef<string>()

  React.useEffect(() => {
    csvMemo.current = undefined
  }, [tracks])

  function handleCsvExport() {
    try {
      let csv = csvMemo.current
      if (!csv) {
        csv = tracksAsCsv(tracks, [
          'id',
          'name',
          'artist.name',
          'album.name',
          'duration',
          'url',
          'popularity',
        ])
        csvMemo.current = csv
      }

      const anchor = document.createElement('a')
      anchor.download = 'spotify-tracks.csv'

      const blob = new Blob([csv], {type: 'text/csv'})
      const blobUrl = URL.createObjectURL(blob)
      anchor.href = blobUrl
      anchor.style.display = 'none'
      document.body.append(anchor)
      anchor.click()
      anchor.remove()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <RoundButton onClick={handleCsvExport}>
      Export to CSV
    </RoundButton>
  )
}
