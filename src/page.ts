import puppeteer from 'puppeteer'
import * as cheerio from 'cheerio'

const scrollToBottom = async () => {
  const wait = (ms: number) => new Promise((res) => setTimeout(res, ms))

  let atBottom = false
  const scroller = document.documentElement
  let lastPosition = -1

  while (!atBottom) {
    scroller.scrollTop += 1000

    // Wait until the lazy-loaded data is loaded and rendered in the browser.
    await wait(1800)
    const currentPosition = scroller.scrollTop

    if (currentPosition > lastPosition) {
      lastPosition = currentPosition
    } else {
      atBottom = true
    }
  }
}

export const getPage = async (url: string, { loadOnScroll = true }) => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()

  await page.setViewport({ width: 1336, height: 768 })
  await page.goto(url)

  // Scroll to bottom to have lazy-loading data.
  if (loadOnScroll) {
    await page.evaluate(scrollToBottom)
  }

  const content = await page.content()

  await browser.close()

  const $ = cheerio.load(content)

  return $
}
