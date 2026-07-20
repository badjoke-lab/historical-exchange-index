import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const outputRoot = path.join(root, 'artifacts/representative-visual-review')
const manifestPath = path.join(outputRoot, 'manifest.json')
if (!fs.existsSync(manifestPath)) throw new Error('representative visual manifest missing')
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
})[character])

const cards = manifest.records.map((record) => ({
  id: record.id,
  template: record.template,
  route: record.route,
  state: record.state,
  viewport: record.viewport,
  viewport_file: record.viewport_file,
  full_file: record.full_file,
  gate: record.automated_gate,
  owner_status: 'pending',
  failures: record.failures ?? [],
  metrics: record.metrics,
}))

const failureList = manifest.failures.length
  ? `<ul>${manifest.failures.map((failure) => `<li>${esc(failure)}</li>`).join('')}</ul>`
  : '<p>Automated checks found no failures.</p>'

const contactSheet = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>HEI representative visual review</title>
<style>
:root{color-scheme:dark;font-family:ui-sans-serif,system-ui,sans-serif;background:#090d12;color:#edf1f5}
*{box-sizing:border-box}body{margin:0;padding:24px;line-height:1.5}header,main{max-width:1900px;margin:auto}
header{margin-bottom:24px}.notice{padding:14px 16px;border:1px solid #b88746;border-radius:10px;background:#16110b;color:#f1d7b1}
.summary{display:flex;flex-wrap:wrap;gap:10px;margin:16px 0}.pill{padding:6px 10px;border:1px solid #34404c;border-radius:999px;color:#b9c4cf}
.failures{margin:18px 0;padding:16px;border:1px solid #784b45;border-radius:12px;background:#1b1010}.failures h2{margin-top:0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(480px,1fr));gap:20px}.card{overflow:hidden;border:1px solid #34404c;border-radius:14px;background:#10161d}
.card.fail{border-color:#a25e54}.card h2{margin:0;padding:14px 16px 4px;font-size:17px}.meta{padding:0 16px 14px;color:#aeb9c4;font-size:13px}.issues{padding:0 16px 14px;color:#ffb9af;font-size:13px}
.pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);border-top:1px solid #34404c}.shot{min-width:0;background:#fff}.shot+ .shot{border-left:1px solid #34404c}.shot h3{position:sticky;top:0;z-index:1;margin:0;padding:8px 10px;background:#10161d;color:#edf1f5;font-size:12px}.frame{max-height:900px;overflow:auto}.frame img{display:block;width:100%;height:auto}.missing{padding:24px;color:#111}
@media(max-width:900px){body{padding:12px}.grid{grid-template-columns:1fr}.pair{grid-template-columns:1fr}.shot+ .shot{border-left:0;border-top:1px solid #34404c}}
</style>
</head>
<body>
<header>
<h1>HEI representative visual review</h1>
<p>Desktop and mobile representative states. Each card includes the untouched initial viewport and the full page.</p>
<div class="notice">Automated screenshots are review evidence only. Owner approval remains pending.</div>
<div class="summary">
<span class="pill">States ${manifest.state_count}/${manifest.expected_state_count}</span>
<span class="pill">Screenshots ${manifest.screenshot_count}</span>
<span class="pill">Failures ${manifest.failure_count}</span>
<span class="pill">Status ${esc(manifest.status)}</span>
</div>
<section class="failures"><h2>Automated findings</h2>${failureList}</section>
</header>
<main class="grid">
${cards.map((card) => `<article class="card ${card.gate === 'fail' ? 'fail' : ''}">
<h2>${esc(card.id)} · ${esc(card.template)}</h2>
<div class="meta"><code>${esc(card.route)}</code> · ${esc(card.state)} · ${card.viewport.width} × ${card.viewport.height} · gate ${esc(card.gate)} · owner pending</div>
${card.failures.length ? `<div class="issues">${card.failures.map((failure) => `<div>• ${esc(failure)}</div>`).join('')}</div>` : ''}
<div class="pair">
<section class="shot"><h3>Initial viewport</h3><div class="frame">${card.viewport_file ? `<img src="${esc(card.viewport_file)}" alt="${esc(card.id)} initial viewport">` : '<div class="missing">Missing</div>'}</div></section>
<section class="shot"><h3>Full page</h3><div class="frame">${card.full_file ? `<img src="${esc(card.full_file)}" alt="${esc(card.id)} full page">` : '<div class="missing">Missing</div>'}</div></section>
</div>
</article>`).join('')}
</main>
</body>
</html>
`

const ownerReview = {
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  contract_id: manifest.contract_id,
  status: 'awaiting_owner_review',
  automated_capture_counts_as_approval: false,
  owner_approval: false,
  ui_completion: false,
  states: cards.map((card) => ({
    id: card.id,
    template: card.template,
    route: card.route,
    state: card.state,
    viewport: card.viewport,
    automated_gate: card.gate,
    owner_status: 'pending',
    owner_decision: '',
    owner_notes: '',
    viewport_file: card.viewport_file,
    full_file: card.full_file,
  })),
}

fs.writeFileSync(path.join(outputRoot, 'contact-sheet.html'), contactSheet)
fs.writeFileSync(path.join(outputRoot, 'contact-sheet.json'), `${JSON.stringify({
  schema_version: '1.0',
  generated_at: new Date().toISOString(),
  card_count: cards.length,
  cards,
}, null, 2)}\n`)
fs.writeFileSync(path.join(outputRoot, 'owner-review.json'), `${JSON.stringify(ownerReview, null, 2)}\n`)

console.log(JSON.stringify({
  ok: true,
  cards: cards.length,
  failures: manifest.failure_count,
  owner_approval: false,
  status: 'AWAITING OWNER REVIEW',
}, null, 2))
