import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'

const root = process.cwd()
const selfTest = process.argv.includes('--self-test')

function assert(condition, message) {
  if (!condition) throw new Error(`static locale postprocess failed: ${message}`)
}

function localizeJapaneseHtml(html) {
  let output = html
  output = output.replace(/<html\s+lang=["']en["']/i, '<html lang="ja"')
  output = output.replaceAll('"inLanguage":"en"', '"inLanguage":"ja"')
  return output
}

function listHtmlFiles(directory) {
  const files = []
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const absolute = path.join(directory, entry.name)
    if (entry.isDirectory()) files.push(...listHtmlFiles(absolute))
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(absolute)
  }
  return files
}

function runSelfTest() {
  const sample = '<html lang="en"><body><script>{"inLanguage":"en"}</script><a hreflang="en">English</a></body></html>'
  const localized = localizeJapaneseHtml(sample)
  assert(localized.includes('<html lang="ja">'), 'html lang replacement failed')
  assert(localized.includes('"inLanguage":"ja"'), 'JSON-LD inLanguage replacement failed')
  assert(localized.includes('hreflang="en"'), 'hreflang must not be rewritten')

  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'hei-ja-html-'))
  fs.mkdirSync(path.join(tempRoot, 'nested'))
  fs.writeFileSync(path.join(tempRoot, 'index.html'), sample)
  fs.writeFileSync(path.join(tempRoot, 'nested', 'index.html'), sample)
  assert(listHtmlFiles(tempRoot).length === 2, 'recursive HTML discovery failed')
  fs.rmSync(tempRoot, { recursive: true, force: true })

  console.log('Static locale postprocess self-test: pass')
}

if (selfTest) {
  runSelfTest()
  process.exit(0)
}

const jaRoot = path.join(root, 'out', 'ja')
assert(fs.existsSync(jaRoot), 'out/ja does not exist; Japanese public route family was not built')
assert(fs.existsSync(path.join(jaRoot, 'index.html')), 'Japanese root output is missing')

const files = listHtmlFiles(jaRoot)
assert(files.length > 0, 'no Japanese HTML output files found')

let changed = 0
for (const filePath of files) {
  const before = fs.readFileSync(filePath, 'utf8')
  const after = localizeJapaneseHtml(before)
  assert(/<html\s+lang=["']ja["']/i.test(after), `${path.relative(root, filePath)} still lacks html lang=ja`)
  if (before !== after) {
    fs.writeFileSync(filePath, after)
    changed += 1
  }
}

assert(changed > 0, 'no Japanese HTML files required localization; verify build contract before removing this postprocessor')
console.log(`Localized Japanese static HTML: ${changed}/${files.length} files updated.`)
