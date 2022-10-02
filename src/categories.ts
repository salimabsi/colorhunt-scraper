import { getPage } from './page'

export const getCategories = async () => {
  const $ = await getPage('https://colorhunt.co/', {
    loadOnScroll: false,
  })

  // Will be used as a source by colorhunt to populate the search filter window after the browser's javascript is loaded
  const tags = $('.tagBank .button.tag')

  const categories = tags
    .map((_, tag) => ({
      name: tag.attribs['tag'],
      alt: tag.attribs['alt'],
      colored: tag.attribs['type'] === 'color',
    }))
    .toArray()

  return {
    categories,
  }
}
