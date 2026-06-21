import fs from 'node:fs'

const file = '.github/workflows/ci-core.yml'
let text = fs.readFileSync(file, 'utf8')
const marker = '      - run: npm run data:check-projected-enums\n'
const addition = `${marker}      - run: npm run watchlists:test\n      - run: npm run watchlists:check\n`
if (!text.includes('npm run watchlists:check')) {
  if (!text.includes(marker)) throw new Error('CI insertion point missing')
  text = text.replace(marker, addition)
  fs.writeFileSync(file, text, 'utf8')
}
console.log('B2 CI maintenance complete.')
