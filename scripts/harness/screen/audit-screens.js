#!/usr/bin/env node
/**
 * 화면 런타임 점검 하네스.
 * check-screen-conventions.js가 "코드가 컨벤션을 지켰는가"를 정적으로 본다면,
 * 이 스크립트는 "실제로 브라우저에서 열었을 때 멀쩡한가"를 본다 — 정적 분석으로는 잡을 수 없는
 * 영역(콘솔 에러, 빈 화면, 실제 렌더링 여부)을 다룬다.
 *
 * AppShell.tsx의 NAV_MENUS를 코드에서 직접 파싱해서 메뉴 목록을 얻기 때문에, 화면이 추가/삭제돼도
 * 이 스크립트를 손댈 필요가 없다. 메뉴를 하나씩 열어 콘솔 에러를 수집하고, 확인 후 탭을 닫아
 * MAX_TABS 제한에 걸리지 않게 한다.
 *
 * 사용법:
 *   node scripts/audit-screens.js admin      (http://localhost:3001 이 떠 있어야 함)
 *   node scripts/audit-screens.js partner    (http://localhost:3002 이 떠 있어야 함)
 *   node scripts/audit-screens.js admin --screenshots   (화면마다 스크린샷도 저장)
 */
const fs = require('fs')
const path = require('path')
const { chromium } = require('playwright')

function extractMenus(appShellSrc) {
  const groupRe = /\{\s*id: '([^']+)',\s*label: '([^']+)',\s*items: \[([\s\S]*?)\n\s*\],\s*\n\s*\},/g
  const groups = []
  let gm
  while ((gm = groupRe.exec(appShellSrc))) {
    const [, gid, glabel, itemsBlock] = gm
    const itemRe = /\{ id: '([^']+)', label: '([^']+)',.*?implemented: (true|false) \},/g
    const items = []
    let im
    while ((im = itemRe.exec(itemsBlock))) {
      items.push({ id: im[1], label: im[2], implemented: im[3] === 'true' })
    }
    groups.push({ id: gid, label: glabel, items: items.filter((i) => i.implemented) })
  }
  return groups
}

async function main() {
  const app = process.argv[2]
  const withShots = process.argv.includes('--screenshots')
  if (!app || !['admin', 'partner'].includes(app)) {
    console.error('사용법: node scripts/audit-screens.js admin|partner [--screenshots]')
    process.exit(1)
  }
  const isAdmin = app === 'admin'
  const url = isAdmin ? 'http://localhost:3001' : 'http://localhost:3002'
  const appShellPath = path.join(__dirname, '..', '..', '..', 'apps', isAdmin ? 'runNshop-admin' : 'runNshop-partner', 'src', 'shell', 'AppShell.tsx')
  const groups = extractMenus(fs.readFileSync(appShellPath, 'utf-8'))
  const total = groups.reduce((a, g) => a + g.items.length, 0)

  const shotsDir = path.join(__dirname, 'audit-shots', app)
  if (withShots) fs.mkdirSync(shotsDir, { recursive: true })

  console.log(`\n=== ${app} 화면 런타임 점검 (${groups.length}개 메뉴 그룹, ${total}개 화면) ===`)
  console.log(`대상: ${url} (dev 서버가 떠 있어야 함)\n`)

  const browser = await chromium.launch()
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })

  let pageErrors = []
  page.on('pageerror', (e) => pageErrors.push(e.message))
  page.on('console', (msg) => { if (msg.type() === 'error') pageErrors.push(`[console.error] ${msg.text()}`) })

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  } catch (e) {
    console.error(`❌ ${url}에 접속할 수 없습니다. dev 서버를 먼저 실행하세요 (scripts/start-${app}.sh). (${e.message})`)
    await browser.close()
    process.exit(1)
  }

  const results = []

  for (const group of groups) {
    for (const item of group.items) {
      pageErrors = []
      let status = 'OK'
      let detail = ''
      try {
        await page.locator('.nav-item__label', { hasText: group.label }).click()
        await page.waitForTimeout(100)
        await page.locator('.nav-dropdown__item', { hasText: item.label }).first().click()
        await page.waitForTimeout(400)

        const panel = page.locator('[role="tabpanel"]:not([hidden])').last()
        const text = await panel.innerText().catch(() => '')
        if (!text || text.trim().length < 2) {
          status = 'EMPTY'
          detail = '탭 내용이 비어 있음'
        }
        if (pageErrors.length > 0) {
          status = 'ERROR'
          detail = pageErrors.slice(0, 2).join(' | ')
        }
        if (withShots) {
          const fname = item.id.replace(/\//g, '_') + '.png'
          await panel.screenshot({ path: path.join(shotsDir, fname) }).catch(() => {})
        }
      } catch (e) {
        status = 'FAIL'
        detail = e.message.split('\n')[0]
      }

      // 확인한 탭 닫기 (MAX_TABS 제한 방지) — pinned 대시보드는 애초에 목록에 없으므로 항상 닫기 가능
      try {
        await page.locator('[role="tab"]', { hasText: item.label }).locator('.tab__close, .tab-close, [aria-label="닫기"]').first().click({ timeout: 2000 })
        await page.waitForTimeout(100)
      } catch { /* 닫기 실패해도 결과 기록은 진행 */ }

      results.push({ id: item.id, label: item.label, status, detail })
      const icon = status === 'OK' ? '✅' : status === 'EMPTY' ? '⚪' : '❌'
      console.log(`${icon} [${group.label} > ${item.label}] ${item.id}${detail ? ' — ' + detail : ''}`)
    }
  }

  await browser.close()

  const bad = results.filter((r) => r.status !== 'OK')
  console.log(`\n=== 결과: ${results.length - bad.length}/${results.length} 정상 ===`)
  if (bad.length) {
    console.log(`\n문제 있는 화면 (${bad.length}개):`)
    bad.forEach((r) => console.log(`  ${r.status} ${r.id} — ${r.detail}`))
  }
  if (withShots) console.log(`\n스크린샷: ${path.relative(process.cwd(), shotsDir)}`)
  process.exit(bad.length ? 1 : 0)
}

main()
