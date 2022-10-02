import * as fs from 'fs'
import { getCategories } from './categories'
import { getColors } from './colors'

const runApp = async () => {
  console.log('Fetching categories...')
  const categories = await getCategories()
  console.log('Categories fetched successfully.')

  console.log('Fetching colors...')
  const colors = await getColors()
  console.log('Colors fetched successfully.')

  fs.writeFileSync('colorhunt.json', JSON.stringify({ categories, colors }))
}

runApp()
