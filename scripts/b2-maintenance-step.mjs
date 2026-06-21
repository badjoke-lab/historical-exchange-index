import fs from 'node:fs'

function insertAfter(file, marker, lines, sentinel) {
  let text = fs.readFileSync(file, 'utf8')
  if (text.includes(sentinel)) return
  if (!text.includes(marker)) throw new Error(`${file}: insertion point missing`)
  text = text.replace(marker, `${marker}${lines}`)
  fs.writeFileSync(file, text, 'utf8')
}

insertAfter(
  '.github/workflows/ci-core.yml',
  '      - run: npm run data:check-projected-enums\n',
  '      - run: npm run watchlists:test\n      - run: npm run watchlists:check\n',
  'npm run watchlists:check',
)

insertAfter(
  '.github/workflows/hei-monitoring-v2.yml',
  '      - run: npm run monitor:smoke\n',
  '      - run: npm run watchlists:check\n',
  'npm run watchlists:check',
)

console.log('B2 workflow maintenance complete.')
