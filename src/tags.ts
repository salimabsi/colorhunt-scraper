import { getPage } from './page'

type Category = {
  name: string
  alt: string
}

export const getTags = async () => {
  const $ = await getPage('https://colorhunt.co/', {
    loadOnScroll: false,
  })

  // Will be used as a source by colorhunt to populate the search filter window after the browser's javascript is loaded
  const tags = $('.tagBank .button.tag')

  const categories: Category[] = []

  tags.each((_, tag) => {
    const alt = tag.attribs['alt']
    const name = tag.attribs['tag']

    categories.push({ name, alt })
  })

  return {
    categories,
  }
}
