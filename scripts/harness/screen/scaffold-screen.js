#!/usr/bin/env node
/**
 * 새 화면 스캐폴딩 하네스.
 * 가이드(src/guide/tabs/NewScreenGuide.tsx)에 정리된 실제 컨벤션을 그대로 코드로 옮긴 것 —
 * 문서만 보고 AI/사람이 매번 손으로 재현하던 배선(폴더/파일/AppShell 등록)을 자동화한다.
 *
 * 사용법:
 *   node scripts/scaffold-screen.js --app=admin --domain=promotion --feature=event --label="이벤트관리" --menu=promotion
 *   node scripts/scaffold-screen.js --app=partner --domain=promotion --feature=event --label="이벤트관리" --menu=promotion --write
 *
 * 기본은 dry-run이다 (아무 파일도 쓰지 않고, 무엇을 할지만 출력한다).
 * 실제로 파일을 쓰고 AppShell.tsx를 수정하려면 --write 플래그를 추가한다.
 */
const fs = require('fs')
const path = require('path')

function parseArgs(argv) {
  const args = {}
  for (const arg of argv) {
    const m = arg.match(/^--([^=]+)(?:=(.*))?$/)
    if (m) args[m[1]] = m[2] === undefined ? true : m[2]
  }
  return args
}

function toPascalCase(kebab) {
  return kebab.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('')
}

function toPrefix(kebab) {
  return kebab.replace(/-/g, '').slice(0, 3).toUpperCase()
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const { app, domain, feature, label, menu } = args
  const write = !!args.write

  if (!app || !['admin', 'partner'].includes(app)) {
    console.error('사용법: --app=admin|partner --domain=<폴더명> --feature=<kebab-case> --label="<한글 메뉴명>" [--menu=<NAV_MENUS id>] [--write]')
    process.exit(1)
  }
  if (!domain || !feature || !label) {
    console.error('--domain, --feature, --label은 필수입니다.')
    process.exit(1)
  }
  const menuId = menu || domain
  const isAdmin = app === 'admin'
  const appDir = path.join(__dirname, '..', '..', '..', 'apps', isAdmin ? 'runNshop-admin' : 'runNshop-partner')
  const srcDir = path.join(appDir, 'src')
  const featureDir = path.join(srcDir, domain, feature)
  const Name = toPascalCase(feature)
  const camelName = Name.charAt(0).toLowerCase() + Name.slice(1)
  const Snake = feature.replace(/-/g, '_').toUpperCase()
  const prefix = toPrefix(feature)
  const idField = isAdmin ? `${camelName}Id` : `${feature.replace(/-/g, '_')}_id`
  const updatedAtField = isAdmin ? 'updatedAt' : 'updated_at'
  const importAlias = `@/${domain}/${feature}`

  // 이름 충돌 검사: AppShell.tsx에 이미 같은 이름의 import/컴포넌트가 있으면
  // (예: 서로 다른 기능이 우연히 같은 PascalCase가 되는 경우) 조용히 덮어쓰지 않고 바로 중단한다.
  const appShellPathForCheck = path.join(srcDir, 'shell', 'AppShell.tsx')
  const appShellSrcForCheck = fs.readFileSync(appShellPathForCheck, 'utf-8')
  const collisionRe = new RegExp(`\\b${Name}Page\\b`)
  const collisionMatch = appShellSrcForCheck.match(collisionRe)
  if (collisionMatch) {
    const importLineMatch = appShellSrcForCheck.match(new RegExp(`^import ${Name}Page from '([^']+)'`, 'm'))
    console.error(`\n❌ 이름 충돌: '${Name}Page'가 AppShell.tsx에 이미 존재합니다` +
      (importLineMatch ? ` (${importLineMatch[1]})` : '') +
      `.\n   --feature 슬러그를 바꿔서 다른 PascalCase 이름이 나오게 하세요 (예: --feature=${feature}-mgmt).`)
    process.exit(1)
  }
  if (fs.existsSync(featureDir)) {
    console.error(`\n❌ 폴더가 이미 존재합니다: ${path.relative(process.cwd(), featureDir)} — 다른 --feature를 쓰거나 기존 폴더를 먼저 정리하세요.`)
    process.exit(1)
  }

  console.log(`\n=== 새 화면 스캐폴딩: ${app} / ${domain}/${feature} (${label}) ===`)
  console.log(write ? '[WRITE 모드] 실제로 파일을 생성하고 AppShell.tsx를 수정합니다.\n' : '[DRY-RUN] 아무것도 쓰지 않습니다. --write를 추가하면 실제로 생성합니다.\n')

  const files = {}

  // ---------------------------------------------------------------------
  // mockData.ts
  // ---------------------------------------------------------------------
  files['mockData.ts'] = isAdmin ? `export type ${Name}Status = 'ACTIVE' | 'INACTIVE'

export interface ${Name} {
  ${idField}: string
  name: string
  status: ${Name}Status
  memo: string
  createdBy: string
  createdAt: string
  updatedBy: string
  updatedAt: string
}

export interface ${Name}Filter {
  keyword: string
  status: ${Name}Status | 'ALL'
}

export const ${Snake}_STATUS_LABEL: Record<${Name}Status, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
}

export const MOCK_${Snake}S: ${Name}[] = [
  { ${idField}: '${prefix}-001', name: '샘플 ${label} 1', status: 'ACTIVE', memo: '', createdBy: 'admin', createdAt: '2026.01.01 10:00', updatedBy: 'admin', updatedAt: '2026.01.01 10:00' },
  { ${idField}: '${prefix}-002', name: '샘플 ${label} 2', status: 'ACTIVE', memo: '', createdBy: 'admin', createdAt: '2026.01.02 10:00', updatedBy: 'admin', updatedAt: '2026.01.02 10:00' },
  { ${idField}: '${prefix}-003', name: '샘플 ${label} 3', status: 'INACTIVE', memo: '', createdBy: 'admin', createdAt: '2026.01.03 10:00', updatedBy: 'admin', updatedAt: '2026.01.03 10:00' },
]

let _${camelName}Seq = MOCK_${Snake}S.length + 1
export function next${Name}Id(): string {
  return \`${prefix}-\${String(_${camelName}Seq++).padStart(3, '0')}\`
}

export function filter${Name}s(items: ${Name}[], filter: ${Name}Filter): ${Name}[] {
  return items.filter((it) => {
    if (filter.keyword.trim()) {
      const kw = filter.keyword.trim().toLowerCase()
      if (!it.name.toLowerCase().includes(kw) && !it.${idField}.toLowerCase().includes(kw)) return false
    }
    if (filter.status !== 'ALL' && it.status !== filter.status) return false
    return true
  })
}
` : `export type ${Name}Status = 'ACTIVE' | 'INACTIVE'

export interface ${Name} {
  ${idField}: string
  name: string
  status: ${Name}Status
  memo: string
  updated_at: string
}

export const ${Snake}_STATUS_LABEL: Record<${Name}Status, string> = {
  ACTIVE: '활성',
  INACTIVE: '비활성',
}

export const MOCK_${Snake}S: ${Name}[] = [
  { ${idField}: '${prefix}-1001', name: '샘플 ${label} 1', status: 'ACTIVE', memo: '', updated_at: '2026.01.01 10:00' },
  { ${idField}: '${prefix}-1002', name: '샘플 ${label} 2', status: 'ACTIVE', memo: '', updated_at: '2026.01.02 10:00' },
  { ${idField}: '${prefix}-1003', name: '샘플 ${label} 3', status: 'INACTIVE', memo: '', updated_at: '2026.01.03 10:00' },
]
`

  // ---------------------------------------------------------------------
  // <Name>StatusBadge.tsx
  // ---------------------------------------------------------------------
  const badgeAttr = `data-${feature}-status`
  files[`${Name}StatusBadge.tsx`] = `'use client'
import { type ${Name}Status, ${Snake}_STATUS_LABEL } from './mockData'

// 주의: 프로모션 계열 도메인이면 새 속성을 만들지 말고 data-product-status 재사용을 검토할 것
// (컴포넌트 가이드 > StatusBadge 예외 참고). 그 외 도메인은 이 새 속성(${badgeAttr})을 그대로 쓰면 된다.
export function ${Name}StatusBadge({ status }: { status: ${Name}Status }) {
  return <span className="badge" ${badgeAttr}={status}>{${Snake}_STATUS_LABEL[status]}</span>
}
`

  // ---------------------------------------------------------------------
  // <Name>Detail.tsx
  // ---------------------------------------------------------------------
  files[`${Name}Detail.tsx`] = `'use client'
import { useState } from 'react'
import { InnerTabs } from '@/shell/shared/InnerTabs'
import { DetailShell, type DetailMode } from '@/shell/shared/DetailShell'
import { type ${Name}, type ${Name}Status, ${Snake}_STATUS_LABEL } from './mockData'
import { ${Name}StatusBadge } from './${Name}StatusBadge'

function BasicInfoTab({ item, onUpdate, readOnly = false }: {
  item: ${Name}
  onUpdate: (updated: ${Name}) => void
  readOnly?: boolean
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState({ name: item.name, status: item.status, memo: item.memo })

  function handleSave() {
    onUpdate({ ...item, ...draft, ${updatedAtField}: '2026.01.01 10:00' })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="tab-panel-content">
        <div className="add-form" style={{ padding: 0 }}>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>이름 <span className="add-form__req">*</span></label>
              <input type="text" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field">
              <label>상태</label>
              <select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as ${Name}Status })}>
                {Object.entries(${Snake}_STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div className="add-form__row">
            <div className="add-form__field add-form__field--full">
              <label>메모</label>
              <input type="text" value={draft.memo} onChange={(e) => setDraft({ ...draft, memo: e.target.value })} />
            </div>
          </div>
          <div className="section-editor-footer">
            <button className="btn-tool btn-tool--cancel" onClick={() => setEditing(false)}>취소</button>
            <button className="btn-tool btn-tool--add" disabled={!draft.name.trim()} onClick={handleSave}>저장</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="tab-panel-content">
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button className="btn-tool btn-tool--toggle" disabled={readOnly} onClick={() => setEditing(true)}>편집</button>
      </div>
      <div className="info-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <dl className="info-dl">
          <div className="info-row"><dt>ID</dt><dd style={{ fontWeight: 600 }}>{item.${idField}}</dd></div>
          <div className="info-row"><dt>이름</dt><dd style={{ fontWeight: 600 }}>{item.name}</dd></div>
        </dl>
        <dl className="info-dl">
          <div className="info-row"><dt>상태</dt><dd><${Name}StatusBadge status={item.status} /></dd></div>
          <div className="info-row"><dt>메모</dt><dd>{item.memo || '-'}</dd></div>
        </dl>
      </div>
    </div>
  )
}

export default function ${Name}Detail({ item: initialItem, mode = 'modal', onClose, onUpdate, readOnly = false }: {
  item: ${Name}
  mode?: DetailMode
  onClose?: () => void
  onUpdate: (updated: ${Name}) => void
  readOnly?: boolean
}) {
  const [item, setItem] = useState<${Name}>(initialItem)

  function handleUpdate(updated: ${Name}) {
    setItem(updated)
    onUpdate(updated)
  }

  return (
    <DetailShell mode={mode} title={item.name}
      meta={<>
        <span style={{ fontSize: 12, color: '#64748b' }}>{item.${idField}}</span>
        <${Name}StatusBadge status={item.status} />
      </>}
      onClose={onClose}>
      <InnerTabs tabs={[
        { key: 'basic', label: '기본정보', content: <BasicInfoTab item={item} onUpdate={handleUpdate} readOnly={readOnly} /> },
      ]} />
    </DetailShell>
  )
}
`

  // ---------------------------------------------------------------------
  // <Name>Page.tsx
  // ---------------------------------------------------------------------
  const notSupportedAlert = isAdmin ? `alert('아직 구현되지 않은 기능입니다.')` : `alert('프로토타입에서는 지원하지 않는 기능입니다.')`

  files[`${Name}Page.tsx`] = `'use client'
import { useState } from 'react'
import { Pagination } from '@/shell/shared/Pagination'
import { type DetailMode } from '@/shell/shared/DetailShell'
import { useDetailOpener } from '@/shell/shared/useDetailOpener'
import ${Name}Detail from './${Name}Detail'
import {
  type ${Name}, type ${Name}Status, type ${Name}Filter,
  ${Snake}_STATUS_LABEL,
  MOCK_${Snake}S, filter${Name}s,
} from './mockData'
import { ${Name}StatusBadge } from './${Name}StatusBadge'

const STATUS_OPTIONS: Array<{ label: string; value: ${Name}Status | 'ALL' }> = [
  { label: '전체 상태', value: 'ALL' },
  ...Object.entries(${Snake}_STATUS_LABEL).map(([k, v]) => ({ label: v, value: k as ${Name}Status })),
]

function FilterBar({ filter, onChange, onSearch }: {
  filter: ${Name}Filter
  onChange: (f: ${Name}Filter) => void
  onSearch: () => void
}) {
  return (
    <div className="filter-bar">
      <input type="text" placeholder="ID / 이름 검색" value={filter.keyword}
        onChange={(e) => onChange({ ...filter, keyword: e.target.value })}
        onKeyDown={(e) => e.key === 'Enter' && onSearch()} />
      <select value={filter.status}
        onChange={(e) => onChange({ ...filter, status: e.target.value as ${Name}Status | 'ALL' })}>
        {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <button className="btn-search" onClick={onSearch}>조회</button>
    </div>
  )
}

function SummaryBar({ items }: { items: ${Name}[] }) {
  const active = items.filter((it) => it.status === 'ACTIVE').length
  return (
    <div className="summary-bar">
      <div className="summary-card">
        <div className="summary-card__label">전체</div>
        <div className="summary-card__count">{items.length}건</div>
      </div>
      <div className="summary-card summary-card--info">
        <div className="summary-card__label">활성</div>
        <div className="summary-card__count">{active}건</div>
      </div>
    </div>
  )
}

function Toolbar() {
  return (
    <div className="pgm-toolbar">
      <span />
      <div className="pgm-toolbar__actions">
        <button className="btn-tool btn-tool--add" onClick={() => ${notSupportedAlert}}>+ ${label} 등록</button>
      </div>
    </div>
  )
}

function ${Name}Table({ items, onRowClick }: { items: ${Name}[]; onRowClick: (it: ${Name}) => void }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>이름</th>
            <th>상태</th>
            <th>최종수정</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it) => (
            <tr key={it.${idField}} onClick={() => onRowClick(it)}>
              <td className="link-cell">{it.${idField}}</td>
              <td style={{ fontWeight: 500 }}>{it.name}</td>
              <td><${Name}StatusBadge status={it.status} /></td>
              <td style={{ fontSize: 12, color: '#64748b' }}>{it.${updatedAtField}}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// 호출방식: 대부분의 화면은 'modal'(팝업)을 기본값으로 쓴다. 열어둔 채 다른 화면과 오가며 작업해야 하면 'tab'으로 바꾼다.
const DETAIL_MODE: DetailMode = 'modal'

export default function ${Name}Page() {
  const [allItems, setAllItems] = useState<${Name}[]>(MOCK_${Snake}S)
  const [filter, setFilter] = useState<${Name}Filter>({ keyword: '', status: 'ALL' })
  const [displayed, setDisplayed] = useState<${Name}[]>([])
  const [searched, setSearched] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const { open: openDetail, modalElement: detailModal, setModalItem } = useDetailOpener<${Name}>({
    mode: DETAIL_MODE,
    getTabId: (item) => \`${feature}-detail/\${item.${idField}}\`,
    getTabLabel: (item) => \`${label} \${item.${idField}}\`,
    renderDetail: (item, onClose) => (
      <${Name}Detail mode={DETAIL_MODE} item={item} onClose={onClose} onUpdate={handleUpdate} />
    ),
  })

  const totalPages = Math.max(1, Math.ceil(displayed.length / pageSize))
  const pageItems = displayed.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch() {
    setDisplayed(filter${Name}s(allItems, filter))
    setPage(1)
    setSearched(true)
  }

  function handleUpdate(updated: ${Name}) {
    const next = allItems.map((it) => it.${idField} === updated.${idField} ? updated : it)
    setAllItems(next)
    setDisplayed(filter${Name}s(next, filter))
    setModalItem(updated)
  }

  return (
    <div className="page">
      <div className="page-title-row">
        <h1 className="page-title">${label}</h1>
      </div>

      <FilterBar filter={filter} onChange={setFilter} onSearch={handleSearch} />

      {displayed.length > 0 ? (
        <>
          <div className="op-summary-row">
            <SummaryBar items={displayed} />
            <Toolbar />
          </div>
          <${Name}Table items={pageItems} onRowClick={openDetail} />
          <Pagination page={page} totalPages={totalPages} pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={(s) => { setPageSize(s); setPage(1) }} />
        </>
      ) : (
        <div className="table-wrap">
          <p className="state-msg">
            {searched ? '조건에 맞는 ${label}이(가) 없습니다.' : '조회 버튼을 눌러 ${label} 목록을 불러오세요.'}
          </p>
        </div>
      )}

      {detailModal}
    </div>
  )
}
`

  for (const [fname, content] of Object.entries(files)) {
    console.log(`--- ${path.join(domain, feature, fname)} ---`)
    if (!write) console.log(content.split('\n').slice(0, 4).join('\n') + '\n... (dry-run: 전체 내용은 --write 실행 시 파일로 생성됩니다)\n')
  }

  // ---------------------------------------------------------------------
  // AppShell.tsx 등록 계획 계산
  // ---------------------------------------------------------------------
  const appShellPath = path.join(srcDir, 'shell', 'AppShell.tsx')
  const appShellSrc = fs.readFileSync(appShellPath, 'utf-8')
  const importLine = `import ${Name}Page from '${importAlias}/${Name}Page'`
  const navMenusIdx = appShellSrc.indexOf('const NAV_MENUS')
  if (navMenusIdx === -1) {
    console.error('AppShell.tsx에서 NAV_MENUS를 찾지 못했습니다 — 수동으로 등록하세요.')
    process.exit(1)
  }
  const groupMarker = `id: '${menuId}',`
  const groupIdx = appShellSrc.indexOf(groupMarker)
  if (groupIdx === -1) {
    console.error(`AppShell.tsx에서 메뉴 그룹 id: '${menuId}'를 찾지 못했습니다 — --menu 값을 확인하거나 새 그룹을 수동으로 추가하세요.`)
    process.exit(1)
  }
  const itemsIdx = appShellSrc.indexOf('items: [', groupIdx)
  const closeIdx = appShellSrc.indexOf('\n    ],', itemsIdx)
  if (itemsIdx === -1 || closeIdx === -1) {
    console.error('items 배열의 닫는 위치를 찾지 못했습니다 — 수동으로 등록하세요.')
    process.exit(1)
  }
  const newItemLine = `\n      { id: '${domain}/${feature}', label: '${label}', getElement: () => <${Name}Page />, implemented: true },`

  console.log(`--- AppShell.tsx 변경 계획 ---`)
  console.log(`1) import 추가 (NAV_MENUS 선언 직전):\n   ${importLine}`)
  console.log(`2) '${menuId}' 그룹의 items 배열 끝에 추가:\n   ${newItemLine.trim()}`)

  if (write) {
    fs.mkdirSync(featureDir, { recursive: true })
    for (const [fname, content] of Object.entries(files)) {
      fs.writeFileSync(path.join(featureDir, fname), content)
    }
    const withImport = appShellSrc.slice(0, navMenusIdx) + importLine + '\n\n' + appShellSrc.slice(navMenusIdx)
    const shiftedCloseIdx = closeIdx + (importLine.length + 2)
    const withItem = withImport.slice(0, shiftedCloseIdx) + newItemLine + withImport.slice(shiftedCloseIdx)
    fs.writeFileSync(appShellPath, withItem)
    console.log(`\n✅ ${Object.keys(files).length}개 파일 생성 + AppShell.tsx 등록 완료: ${path.relative(process.cwd(), featureDir)}`)
    console.log(`   다음: npx tsc --noEmit 로 타입체크 후, mockData.ts의 필드/상태값을 실제 요구사항에 맞게 수정하세요.`)
  } else {
    console.log(`\n(dry-run) --write를 추가하면 위 ${Object.keys(files).length}개 파일 생성 + AppShell.tsx 수정을 실제로 수행합니다.`)
  }
}

main()
