import * as puppeteer from 'puppeteer-core'
import {CsvTrack} from './index'

export default async function run(track: CsvTrack) {
  let browser: puppeteer.Browser
  try {
    browser = await puppeteer.launch({
      executablePath: '/opt/google/chrome/chrome',
      defaultViewport: {height: 768, width: 1366},
      userDataDir:
        '/home/andre.matulionis/chrome-youtube-data',
      headless: false,
      slowMo: 50,
    })
    addToLibrary(browser, track)
  } catch (e) {
    console.error(e)
    if (browser) {
      await browser.close()
    }
  }
}

async function addToLibrary(
  browser: puppeteer.Browser,
  track: CsvTrack
) {
  const page = await browser.newPage()
  await page.goto('https://music.youtube.com')
  await page.screenshot({
    path: '/home/andre.matulionis/screenshot.png',
  })
  await page.click('ytmusic-search-box paper-icon-button')
  await page.type(
    'ytmusic-search-box input',
    `${track.name} ${track['artist.name']}`
  )
  await page.keyboard.press('Enter')
  await page.waitForNavigation({
    waitUntil: 'networkidle0',
  })
  const musicChip = await page.evaluateHandle<puppeteer.ElementHandle>(
    () => {
      const chipNodes = Array.from(
        document.querySelectorAll(
          'ytmusic-chip-cloud-renderer ytmusic-chip-cloud-chip-renderer'
        )
      ) as HTMLElement[]
      console.log({chipNodes})
      const musicChipNode = chipNodes.find(chipNode =>
        chipNode.textContent.includes('Músicas')
      )

      if (!musicChipNode) {
        throw Error('Music Chip not found')
      }
      return musicChipNode
    }
  )

  musicChip.click()

  const result = await page.evaluateHandle<puppeteer.ElementHandle>(
    () => {
      const resultNodes = Array.from(
        document.querySelectorAll(
          'ytmusic-responsive-list-item-renderer'
        )
      ) as HTMLElement[]
      const correctResultNode = resultNodes.find(
        (resultNode: HTMLElement) => {
          let isName = false
          let isArtist = false
          let isAlbum = false
          const stringNodes = Array.from(
            resultNode.querySelectorAll(
              'yt-formatted-string'
            )
          )
          stringNodes.forEach(stringNode => {
            if (
              stringNode.getAttribute('title') ===
              track.name
            ) {
              isName = true
            } else if (
              stringNode.getAttribute('title') ===
              track['artist.name']
            ) {
              isArtist = true
            } else if (
              stringNode.getAttribute('title') ===
              track['album.name']
            ) {
              isAlbum = true
            }
          })

          return isName && isArtist && isAlbum
        },
        []
      )

      if (!correctResultNode) {
        throw Error('Could not find correct result')
      }
      return correctResultNode
    }
  )

  ;(
    await result.$('ytmusic-menu-renderer iron-icon')
  ).click()

  const addToLibraryButton = await page.evaluateHandle<puppeteer.ElementHandle>(
    () => {
      const menuItemNodes = Array.from(
        document.querySelectorAll(
          'paper-listbox ytmusic-menu-navigation-item-renderer'
        )
      )

      return menuItemNodes.find(menuItemNode =>
        menuItemNode.textContent.includes(
          'Adicionar à biblioteca'
        )
      )
    }
  )

  addToLibraryButton.click()

  await page.close()
}
