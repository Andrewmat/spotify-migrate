import * as fs from 'fs'
import * as path from 'path'
import * as csvParse from 'csv-parse'

export default async function read<RecordType>(
  fileName: string
): Promise<RecordType[]> {
  const result = []
  // following recipe https://csv.js.org/parse/recipies/async.iterator/
  const items = fs
    .createReadStream(path.resolve(fileName), {
      encoding: 'utf8',
    })
    .pipe(
      csvParse({
        columns: true,
        encoding: 'utf8',
      })
    )

  // @ts-ignore ignoring for now
  for await (const item of items) {
    result.push(item)
  }
  return result as RecordType[]
}
