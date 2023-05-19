import { outputJSON } from 'fs-extra'
import { getCategories } from './categories'
import { getPalettes } from './palettes'

async function runScrapper() {
  try {
    const { categories } = await getCategories()
    const { palettes } = await getPalettes()

    outputJSON('data/colorhunt.json', { categories, palettes })
    console.log('Data saved successfully.')
  } catch (error) {
    console.error('Error scraping ColorHunt.co\n', error)
    process.exit(1)
  }
}

runScrapper()
