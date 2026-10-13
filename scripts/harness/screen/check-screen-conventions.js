#!/usr/bin/env node
/**
 * 화면 컨벤션 자동 검사 하네스.
 * 가이드에 정리된 규칙 중 "기계적으로 검사 가능한 것"만 스캔한다 — 간격/시각적 판단이 필요한 규칙은
 * 다루지 않는다 (사람/AI 리뷰 필요). 오탐 가능성이 있는 항목은 WARN으로, 확실한 것은 ERROR로 구분한다.
 *
 * 사용법: node scripts/check-screen-conventions.js admin|partner
 */
const fs = require('fs')
const path = require('path')

function walk(dir, exts, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.next') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, exts, out)
    else if (exts.some((e) => entry.name.endsWith(e))) out.push(full)
  }
  return out
}

function main() {
  const app = process.argv[2]
  if (!app || !['admin', 'partner'].includes(app)) {
    console.error('사용법: node scripts/check-screen-conventions.js admin|partner')
    process.exit(1)
  }
  const isAdmin = app === 'admin'
  const appDir = path.join(__dirname, '..', '..', '..', 'apps', isAdmin ? 'runNshop-admin' : 'runNshop-partner')
  const srcDir = path.join(appDir, 'src')
  const appShellPath = path.join(srcDir, 'shell', 'AppShell.tsx')
  const appShellSrc = fs.readFileSync(appShellPath, 'utf-8')

  const errors = []
  const warnings = []

  const allTsx = walk(srcDir, ['.tsx'])
  const pageFiles = allTsx.filter((f) => path.basename(f).endsWith('Page.tsx') && !f.includes(`${path.sep}guide${path.sep}`) && !f.includes(`${path.sep}shell${path.sep}`))
  const detailFiles = allTsx.filter((f) => path.basename(f).endsWith('Detail.tsx'))
  const badgeFiles = allTsx.filter((f) => path.basename(f).endsWith('StatusBadge.tsx'))

  // -------------------------------------------------------------------
  // 1. AppShell 등록 확인
  // -------------------------------------------------------------------
  for (const f of pageFiles) {
    const compName = path.basename(f, '.tsx')
    const rel = path.relative(srcDir, f)
    if (!new RegExp(`\\b${compName}\\b`).test(appShellSrc)) {
      errors.push(`[미등록] ${rel} — '${compName}'가 AppShell.tsx에 없습니다 (메뉴에서 열 수 없음)`)
    }
  }

  // -------------------------------------------------------------------
  // 2. op-summary-row 래핑 확인 (휴리스틱: 같은 파일에 summary-bar + pgm-toolbar가 있는데 op-summary-row가 없으면 경고)
  // -------------------------------------------------------------------
  for (const f of pageFiles) {
    const content = fs.readFileSync(f, 'utf-8')
    const hasSummary = content.includes('className="summary-bar"')
    const hasToolbar = content.includes('className="pgm-toolbar"')
    const hasWrapper = content.includes('op-summary-row')
    if (hasSummary && hasToolbar && !hasWrapper) {
      errors.push(`[op-summary-row 누락] ${path.relative(srcDir, f)} — summary-bar와 pgm-toolbar가 있는데 op-summary-row로 감싸지 않음 (레이아웃 버그)`)
    }
  }

  // -------------------------------------------------------------------
  // 3. DetailShell 사용 확인 (정보성 — 옛날 방식 손짜기 모달도 유효하므로 WARN)
  // -------------------------------------------------------------------
  for (const f of detailFiles) {
    const content = fs.readFileSync(f, 'utf-8')
    if (!content.includes('DetailShell')) {
      warnings.push(`[DetailShell 미사용] ${path.relative(srcDir, f)} — 팝업/탭 겸용 구조 대신 다른 방식을 쓰고 있음 (의도적이면 무시 가능)`)
    }
  }

  // -------------------------------------------------------------------
  // 4. StatusBadge data-*-status 속성 충돌 확인
  // -------------------------------------------------------------------
  const attrToOwners = new Map()
  for (const f of badgeFiles) {
    const content = fs.readFileSync(f, 'utf-8')
    const m = content.match(/data-([a-z-]+)-status=/)
    if (!m) continue
    const attr = m[1]
    const domainFolder = path.basename(path.dirname(f))
    if (!attrToOwners.has(attr)) attrToOwners.set(attr, new Set())
    attrToOwners.get(attr).add(domainFolder)
  }
  for (const [attr, owners] of attrToOwners) {
    if (owners.size <= 1) continue
    if (attr === 'product') continue // 알려진 예외: product-list 원본 + 프로모션 계열이 data-product-status를 공유 (컴포넌트 가이드 참고)
    warnings.push(`[배지 속성 충돌] data-${attr}-status가 서로 다른 도메인에서 공유됨: ${[...owners].join(', ')} — 의도된 예외가 아니면 도메인별로 새 속성을 쓸 것`)
  }

  // -------------------------------------------------------------------
  // 결과 출력
  // -------------------------------------------------------------------
  console.log(`\n=== ${app} 화면 컨벤션 검사 ===`)
  console.log(`검사 대상: Page ${pageFiles.length}개, Detail ${detailFiles.length}개, StatusBadge ${badgeFiles.length}개\n`)

  if (errors.length) {
    console.log(`❌ ERROR (${errors.length})`)
    errors.forEach((e) => console.log('  ' + e))
  }
  if (warnings.length) {
    console.log(`\n⚠️  WARN (${warnings.length})`)
    warnings.forEach((w) => console.log('  ' + w))
  }
  if (!errors.length && !warnings.length) {
    console.log('✅ 이상 없음')
  }

  console.log(`\n(이 스크립트는 기계적으로 검사 가능한 규칙만 다룬다 — 간격/색상/레이아웃의 시각적 적절성은 별도 리뷰가 필요하다)`)
  process.exit(errors.length ? 1 : 0)
}

main()
