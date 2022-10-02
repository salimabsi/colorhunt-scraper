import { getPage } from './page'

export const getTags = async () => {
  const $ = await getPage('https://colorhunt.co/', {
    loadOnScroll: false,
  })

  // Will be used as a source by colorhunt to populate the search filter window after the browser's javascript is loaded
  const tags = $('.tagBank .button.tag')

  const categories = tags
    .map((_, tag) => ({
      name: tag.attribs['tag'].toString(),
      alt: tag.attribs['alt'].toString(),
    }))
    .toArray()

  return {
    categories,
  }
}
