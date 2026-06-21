import fs from 'node:fs'

const file = 'config/lineage-a4-application.json'
const data = JSON.parse(fs.readFileSync(file, 'utf8'))
data.baseline_projected_entities = 412
fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
