import * as fs from 'fs'
import { getCategories } from './categories'
import { getPalettes } from './palettes'

async function runApp() {
  const { categories } = await getCategories()
  const { palettes } = await getPalettes()

  fs.writeFileSync('data/colorhunt.json', JSON.stringify({ categories, palettes }))
}

runApp()
