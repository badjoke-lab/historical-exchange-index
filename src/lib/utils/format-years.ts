function yearPart(value: string | null | undefined): string {
  if (!value) return '—'
  return value.slice(0, 4)
}

export function formatYears(launchDate: string | null, deathDate: string | null): string {
  const start = yearPart(launchDate)
  const end = deathDate ? yearPart(deathDate) : '—'
  return `${start}–${end}`
}
