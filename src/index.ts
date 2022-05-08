import * as fs from 'fs'
import { getTags } from './tags'
import { getColors } from './colors'

const runApp = async () => {
  console.log('Fetching tags...')
  const tags = await getTags()
  console.log('Tags fetched successfully.')

  console.log('Fetching colors...')
  const colors = await getColors()
  console.log('Colors fetched successfully.')

  fs.writeFileSync('colorhunt.json', JSON.stringify({ tags, colors }))
}

runApp()
