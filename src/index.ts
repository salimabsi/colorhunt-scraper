import promises from 'fs/promises'
import { getCategories } from './categories'
import { getPalettes } from './palettes'

async function runApp() {
  try {
    const { categories } = await getCategories()
    const { palettes } = await getPalettes()

    promises.writeFile('data/colorhunt.json', JSON.stringify({ categories, palettes }))
    console.log('Data saved successfully.')
  } catch (error) {
    console.error('Error scraping ColorHunt.co\n', error)
    process.exit(1)
  }
}

runApp()
