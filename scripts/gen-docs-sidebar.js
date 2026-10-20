#!/usr/bin/env node
// docs/ 디렉터리 트리로 docsify 사이드바(docs/_sidebar.md)를 생성한다. 의존성 없음.
// 사용: node scripts/gen-docs-sidebar.js [docs 경로]
const fs = require('fs')
const path = require('path')

const root = path.resolve(process.argv[2] || path.join(__dirname, '..', 'docs'))
const SKIP = new Set(['_sidebar.md', 'node_modules', '.git'])
const collator = new Intl.Collator('ko', { numeric: true })
// 최상위 폴더 노출 순서 (나머지는 이름순, archive 는 맨 뒤)
const TOP_ORDER = ['onboarding.md', 'deliverables', 'methodology', 'reference', 'weekly-report', 'review-alignment', 'archive']
const rank = (name) => { const i = TOP_ORDER.indexOf(name); return i < 0 ? TOP_ORDER.length - 1 : i }

// 마크다운 링크 문법을 깨는 ( ) 도 인코딩
const enc = (s) => encodeURIComponent(s).replace(/[()]/g, (c) => (c === '(' ? '%28' : '%29'))
const link = (rel) => '/' + rel.split(path.sep).map(enc).join('/')

function title(file) {
  const h1 = fs.readFileSync(file, 'utf8').match(/^#\s+(.+?)\s*$/m)
  return (h1 ? h1[1] : path.basename(file, '.md')).replace(/[\[\]]/g, '')
}

function walk(dir, depth) {
  const lines = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter((e) => !SKIP.has(e.name) && !e.name.startsWith('.'))
    .sort((a, b) => (depth === 0 ? rank(a.name) - rank(b.name) : 0) || collator.compare(a.name, b.name))
  const indent = '  '.repeat(depth)
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      const sub = walk(full, depth + 1)
      if (!sub.length) continue
      lines.push(`${indent}- ${e.name}`, ...sub)
    } else if (e.name.endsWith('.md')) {
      lines.push(`${indent}- [${title(full)}](${link(path.relative(root, full))})`)
    }
  }
  return lines
}

const out = ['- [홈](/)', ...walk(root, 0).filter((l) => l !== '- [docs](/README.md)')]
fs.writeFileSync(path.join(root, '_sidebar.md'), out.join('\n') + '\n')
console.log(`${out.length} entries -> ${path.join(root, '_sidebar.md')}`)
