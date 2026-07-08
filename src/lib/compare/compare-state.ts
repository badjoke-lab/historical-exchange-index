import type { EntityRecord } from '../types/entity'

export const COMPARE_MIN = 2
export const COMPARE_MAX = 4
export const COMPARE_PARAMETER = 'exchange'

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const MAX_SLUG_CODE_POINTS = 120

type SearchParamsLike = Pick<URLSearchParams, 'getAll'>

export interface CompareState {
  slugs: string[]
}

function codePointLength(value: string): number {
  return [...value].length
}

export function normalizeCompareSlug(value: string): string | null {
  const normalized = value.trim().toLowerCase()
  if (!normalized) return null
  if (codePointLength(normalized) > MAX_SLUG_CODE_POINTS) return null
  if (!SLUG_PATTERN.test(normalized)) return null
  return normalized
}

export function parseCompareState(
  params: SearchParamsLike,
  reviewedSlugs: Iterable<string>,
): CompareState {
  const reviewedLookup = new Map<string, string>()
  for (const slug of reviewedSlugs) {
    reviewedLookup.set(slug.toLowerCase(), slug)
  }

  const slugs: string[] = []
  const seen = new Set<string>()

  for (const raw of params.getAll(COMPARE_PARAMETER)) {
    const normalized = normalizeCompareSlug(raw)
    if (!normalized) continue

    const reviewedSlug = reviewedLookup.get(normalized)
    if (!reviewedSlug || seen.has(reviewedSlug)) continue

    seen.add(reviewedSlug)
    slugs.push(reviewedSlug)
    if (slugs.length >= COMPARE_MAX) break
  }

  return { slugs }
}

export function serializeCompareState(state: CompareState): string {
  const params = new URLSearchParams()
  const seen = new Set<string>()

  for (const slug of state.slugs) {
    const normalized = normalizeCompareSlug(slug)
    if (!normalized || seen.has(normalized)) continue
    seen.add(normalized)
    params.append(COMPARE_PARAMETER, normalized)
    if (seen.size >= COMPARE_MAX) break
  }

  return params.toString()
}

export function resolveComparedEntities(
  entities: EntityRecord[],
  state: CompareState,
): EntityRecord[] {
  const bySlug = new Map(entities.map((entity) => [entity.slug, entity]))
  return state.slugs
    .map((slug) => bySlug.get(slug))
    .filter((entity): entity is EntityRecord => Boolean(entity))
}

function parseIsoDay(value: string | null): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split('-').map(Number)
  const timestamp = Date.UTC(year, month - 1, day)
  const date = new Date(timestamp)

  if (
    date.getUTCFullYear() !== year
    || date.getUTCMonth() !== month - 1
    || date.getUTCDate() !== day
  ) return null

  return timestamp
}

export function calculateLifespanDays(entity: EntityRecord): number | null {
  const launch = parseIsoDay(entity.launch_date)
  const death = parseIsoDay(entity.death_date)
  if (launch === null || death === null || death < launch) return null
  return Math.floor((death - launch) / 86_400_000)
}

export function isComparisonReady(state: CompareState): boolean {
  return state.slugs.length >= COMPARE_MIN && state.slugs.length <= COMPARE_MAX
}
