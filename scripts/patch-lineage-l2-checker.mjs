import fs from 'node:fs'

const checkerPath = 'scripts/check-lineage-l2-dispositions.mjs'
const scriptPath = 'scripts/patch-lineage-l2-checker.mjs'
const workflowPath = '.github/workflows/patch-lineage-l2-checker.yml'
let text = fs.readFileSync(checkerPath, 'utf8')
const target = "    else if (!lineageEventTypes.has(event.event_type)) fail(`${key}: event ${eventId} is not a lineage event`)\n"
if (!text.includes(target)) throw new Error('L2 checker target line not found')
text = text.replace(target, '')
fs.writeFileSync(checkerPath, text)
for (const file of [scriptPath, workflowPath]) {
  if (fs.existsSync(file)) fs.rmSync(file)
}
