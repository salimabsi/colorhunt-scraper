import axios from 'axios'

type Palette = {
  code: string
  likes: string
  date: string
  tags: string
}

function timeAgoToMs(text: string) {
  const second = 1000
  const minute = 60 * second
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 12 * month

  if (text === 'Yesterday') {
    return day
  }

  const number = parseInt(text.split(' ')[0]) // 1, 2, 3 ...etc
  const unit = text.split(' ')[1] // weeks, week, days ...etc

  switch (unit) {
    case 'millisecond':
    case 'milliseconds':
      return number * 1
    case 'second':
    case 'seconds':
      return number * second
    case 'minute':
    case 'minutes':
      return number * minute
    case 'hour':
    case 'hours':
      return number * hour
    case 'day':
    case 'days':
      return number * day
    case 'week':
    case 'weeks':
      return number * week
    case 'month':
    case 'months':
      return number * month
    case 'year':
    case 'years':
      return number * year
    default:
      return 1 * year
  }
}

function normalizePalette(palette: Palette) {
  return {
    code: palette.code,
    likes: parseInt(palette.likes),
    date: timeAgoToMs(palette.date),
    categories: palette.tags,
  }
}

async function fetchPalette(id: string) {
  try {
    // It returns an array of one palette.
    const { data } = await axios.post<[Palette]>(
      'https://colorhunt.co/php/single.php',
      `single=${id}`,
    )

    return data[0]
  } catch (error) {
    return null
  }
}

async function fetchPagePalettes(step: number) {
  const { data } = await axios.post<Palette[]>(
    'https://colorhunt.co/php/feed.php',
    `step=${step}&sort=new&tags=&timeframe=4000`,
  )

  return data
}

async function fetchAllPaletteIDs() {
  // Maximum pages to load on scroll
  const steps = Array(100)
    .fill(null)
    .map((_, i) => i)

  const palettes = []

  for (const step of steps) {
    const data = await fetchPagePalettes(step)

    // No data from the next page means all palletes are fetched
    if (data.length === 0) {
      break
    }
    palettes.push(...data)
    console.log('IDs fetched: ' + palettes.length)
  }

  const ids = palettes.map((p) => p.code)

  return ids
}

async function _getPalettes() {
  const ids = await fetchAllPaletteIDs()

  const palettes = []
  let current = 1

  for (const id of ids) {
    console.log(`Fetching individual palette: ${current}/${ids.length}`)
    current++

    const palette = await fetchPalette(id)
    if (!palette) {
      console.log(`Failed fetching: ${current}`)
      continue
    }

    palettes.push(normalizePalette(palette))
  }

  return palettes
}

export async function getPalettes() {
  try {
    console.log('Fetching palettes...')
    const palettes = await _getPalettes()
    console.log('Palettes fetched successfully.')

    return {
      palettes,
    }
  } catch (error) {
    console.log('Error fetching palettes\n', error)
    process.exit(1)
  }
}
