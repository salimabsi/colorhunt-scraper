import { getPage } from './page'

async function getCategories() {
  try {
    console.log('Fetching categories...')
    const $ = await getPage('https://colorhunt.co/', { loadOnScroll: false })

    // Colorhunt uses these selectors to populate the tags in the search filter after the browser's js loaded
    const tags = $('.tagBank .button.tag')

    const categories = tags
      .map((_, { attribs }) => ({
        name: attribs['tag'],
        isColor: attribs['type'] === 'color',
      }))
      .toArray()

    console.log('Categories fetched successfully.')

    return {
      categories,
    }
  } catch (error) {
    console.error('Failed fetching categories \n', error)
    throw error
  }
}

export { getCategories }
