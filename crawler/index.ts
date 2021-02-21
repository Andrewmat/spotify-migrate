import * as HeadlessChrome from 'simple-headless-chrome'

const browser = new HeadlessChrome({
  headless: true,
  chrome: {
    userDataDir: '/tmp/chrome-user-data',
  },
})

main()

async function main() {
  // TODO access all songs of csv inside Music Youtube
  await browser.init()
  const tab = await browser.newTab({privateTab: false})
  await tab.goTo('https://google.com')
  await tab.type('.gLFyf.gsfi', 'javascript mdn')
  await tab.click('.gNO89b')
  await tab.waitForPageToLoad()
  await tab.saveScreenshot('./screenshot')
  await browser.close()
}
