import dotenv from 'dotenv'
import axios from 'axios'
import { colorhunt } from './colorhunt'

dotenv.config()

type Category = {
  name: string
  colored: boolean
}

type Palette = {
  code: string
  likes: number
  date: number
  categories: number[]
}

type Colorhunt = typeof colorhunt

type Uploaded<T> = {
  data: {
    id: number
    attributes: T
  }
}

async function upload<T>(path: string, data: T) {
  try {
    const response = await axios.post<Uploaded<T>>(
      `${process.env.STRAPI_API_URL}/api/${path}`,
      {
        data: data,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_KEY}`,
        },
      },
    )

    return response.data.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function uploadCategories(categories: Category[]) {
  const uploadedCategories: Uploaded<Category>['data'][] = []

  for (const [index, category] of categories.entries()) {
    const data = await upload('categories', category)
    uploadedCategories.push(data)
    console.log(`Category uploaded: - ${index + 1}/${categories.length}`)
  }

  return uploadedCategories
}

function preparePalette(
  paletteData: Colorhunt['palettes'][number],
  categories: Uploaded<Category>['data'][],
) {
  const paletteCategories = paletteData.categories.split(' ')

  const categoryIds: number[] = []

  paletteCategories.forEach((category) => {
    const found = categories.find((c) => c.attributes.name === category.toLowerCase())
    if (found) {
      categoryIds.push(found.id)
    }
  })

  const palette = {
    code: paletteData.code,
    likes: paletteData.likes,
    date: paletteData.date,
    categories: categoryIds,
  }

  return palette
}

async function uploadPalettes(
  palettes: Colorhunt['palettes'],
  categories: Uploaded<Category>['data'][],
) {
  const uploadedPalettes: Uploaded<Palette>['data'][] = []

  for (const [index, palette] of palettes.entries()) {
    const prepared = preparePalette(palette, categories)
    const data = await upload('palettes', prepared)
    console.log(`Palette uploaded: - ${index + 1}/${palettes.length}`)
    uploadedPalettes.push(data)
  }

  return uploadedPalettes
}

export async function uploadColorhunt(colorhunt: Colorhunt) {
  const uploadedCategories = await uploadCategories(colorhunt.categories)

  const uploadedPalettes = await uploadPalettes(colorhunt.palettes, uploadedCategories)

  console.log(uploadedPalettes)
}

uploadColorhunt(colorhunt)
