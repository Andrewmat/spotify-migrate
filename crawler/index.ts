#!/usr/bin/env ts-node-script
import * as argsLib from 'args'
import read from './csv-service'
import run from './browser'

argsLib
  .option(
    ['f', 'file'],
    'Path to CSV file containing all track values'
  )
  .option(
    ['a', 'artist'],
    'Name of the artist of the tracks that should be added'
  )

interface Args {
  file?: string
  artist?: string
}

export interface CsvTrack {
  id: string
  name: string
  'artist.name': string
  'album.name': string
  duration: string
  url: string
  popularity: string
}

main()
async function main() {
  const args: Args = argsLib.parse(process.argv)
  let tracks = await read<CsvTrack>(args.file)

  if (args.artist) {
    tracks = tracks.filter(t =>
      t['artist.name'].includes(args.artist)
    )
  }

  await run(tracks[0])
}
