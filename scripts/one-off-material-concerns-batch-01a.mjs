import fs from 'node:fs'

function read(path) { return JSON.parse(fs.readFileSync(path, 'utf8')) }
function write(path, value) { fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`) }

const bitfrontPath = 'records/exchanges/bitfront.json'
const bitfront = read(bitfrontPath)
bitfront.entity_correction = {
  entity_id: 'hei_ex_000128',
  expected: {
    predecessor_id: null,
    summary: 'LINE-backed global centralized cryptocurrency exchange operated by LVC USA Inc. It announced a phased voluntary shutdown in late 2022 and scheduled withdrawals to end on 2023-03-31.',
    last_verified_at: '2026-05-22',
    notes: 'Entity death date uses the end of withdrawals and service termination rather than the announcement date.'
  },
  changes: {
    predecessor_id: 'hei_ex_000302',
    summary: bitfront.entity.summary,
    last_verified_at: bitfront.entity.last_verified_at,
    notes: bitfront.entity.notes
  }
}
write(bitfrontPath, bitfront)

const coinbasePath = 'records/exchanges/coinbase-pro.json'
const coinbase = read(coinbasePath)
coinbase.entity.aliases = []
coinbase.entity_correction = {
  entity_id: 'hei_ex_000159',
  expected: {
    successor_id: 'hei_ex_000012',
    launch_date: null,
    death_date: '2023-12-31',
    summary: 'Advanced trading surface under Coinbase that was replaced by Coinbase Advanced, with customer history access ending after December 2023.',
    last_verified_at: '2026-06-19',
    notes: 'Lineage-sensitive product transition. After balance migration, customers could no longer deposit, withdraw, or trade on Coinbase Pro, and transaction history remained accessible only until the end of 2023.'
  },
  changes: {
    successor_id: null,
    launch_date: coinbase.entity.launch_date,
    death_date: coinbase.entity.death_date,
    summary: coinbase.entity.summary,
    last_verified_at: coinbase.entity.last_verified_at,
    notes: coinbase.entity.notes
  }
}
write(coinbasePath, coinbase)

// trigger registered one-shot canonical build
