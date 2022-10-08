import { getPage } from './page'

async function _getCategories() {
  const $ = await getPage('https://colorhunt.co/', {
    loadOnScroll: false,
  })

  // Will be used as a source by colorhunt to populate the search filter window after the browser's javascript is loaded
  const tags = $('.tagBank .button.tag')

  const categories = tags
    .map((_, category) => ({
      name: category.attribs['tag'],
      colored: category.attribs['type'] === 'color',
    }))
    .toArray()

  return categories
}

export async function getCategories() {
  try {
    console.log('Fetching categories...')
    const categories = await _getCategories()
    console.log('Categories fetched successfully.')

    return {
      categories,
    }
  } catch (error) {
    console.log('Error fetching categories\n', error)
    process.exit(1)
  }
}
