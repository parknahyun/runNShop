const { chromium } = require('playwright')

async function main() {
  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = []
  page.on('console', (msg) => { errors.push(`[${msg.type()}] ${msg.text()}`) })
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message))

  await page.goto('http://localhost:3001', { waitUntil: 'networkidle' })
  await page.screenshot({ path: 'shots/repro-01-home.png' })

  console.log('--- clicking 주문 관리 ---')
  await page.getByText('주문 관리', { exact: true }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'shots/repro-02-after-click.png' })

  const menuVisible = await page.locator('text=클레임 목록').count()
  console.log('클레임 목록 visible count:', menuVisible)

  console.log('CONSOLE:', JSON.stringify(errors, null, 2))
  await browser.close()
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })
