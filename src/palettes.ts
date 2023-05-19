import axios from 'axios'
import { parseDate } from './date'

type Palette = {
  code: string
  likes: string
  date: string
  tags: string
}

/**
 * Fetches individual palette.
 */
async function fetchPalette(id: string): Promise<Palette | null> {
  try {
    // It returns an array of a single palette.
    const { data } = await axios.post<[Palette]>(
      'https://colorhunt.co/php/single.php',
      `single=${id}`
    )

    return data[0] || null
  } catch (error) {
    return null
  }
}

/**
 * Fetches palettes of a next page.
 */
async function fetchPagePalettes(pageNumber: number): Promise<Pick<Palette, 'code'>[]> {
  try {
    const { data } = await axios.post<Pick<Palette, 'code'>[]>(
      'https://colorhunt.co/php/feed.php',
      `step=${pageNumber}&sort=new&tags=&timeframe=4000`
    )

    return data
  } catch (error) {
    console.error(`Failed fetching page palettes. Page ${pageNumber}.`)
    throw error
  }
}

/**
 * Fetches all palette IDs for fetching individual palettes.
 */
async function fetchAllPaletteIDs(): Promise<string[]> {
  // Overestimated page numbers to loop through.
  const pageNumbers = Array(100)
    .fill(null)
    .map((_, i) => i)

  const palettes: Pick<Palette, 'code'>[] = []

  for (const pageNumber of pageNumbers) {
    const data = await fetchPagePalettes(pageNumber)

    if (data.length === 0) {
      break
    }

    palettes.push(...data)

    console.log(`${palettes.length} IDs fetched...`)
  }

  return palettes.map(({ code }) => code)
}

async function getPalettes() {
  try {
    console.log('Fetching palettes...')

    const ids = await fetchAllPaletteIDs()
    const palettes = []

    for (const [index, id] of ids.entries()) {
      console.log(`Fetching palette: ${index}/${ids.length}`)

      const palette = await fetchPalette(id)

      if (!palette) {
        console.log(`Failed fetching palette: ${id}.`)
        continue
      }

      // The ID is just a compined palette codes.
      palettes.push({
        code: id,
        likes: parseInt(palette.likes),
        date: parseDate(palette.date),
        tags: palette.tags,
      })
    }

    console.log('Palettes fetched successfully.')

    return { palettes }
  } catch (error) {
    console.error('Failed fetching palettes.')
    throw error
  }
}

export { getPalettes }
