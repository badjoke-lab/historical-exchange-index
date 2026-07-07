import type { CompareSelectionState } from '../types/compare'

export const COMPARE_ROUTE = '/compare/'
export const COMPARE_PARAMETER = 'exchange'
export const COMPARE_MIN_SELECTION = 2
export const COMPARE_MAX_SELECTION = 4

export function parseCompareSelection(
  searchParams: URLSearchParams,
  validSlugs: ReadonlySet<string>,
): CompareSelectionState {
  const selectedSlugs: string[] = []
  const invalidSlugs: string[] = []
  const duplicateSlugs: string[] = []
  const omittedValidSlugs: string[] = []
  const seen = new Set<string>()

  for (const rawValue of searchParams.getAll(COMPARE_PARAMETER)) {
    const slug = rawValue.trim()
    if (!slug) continue

    if (seen.has(slug)) {
      duplicateSlugs.push(slug)
      continue
    }
    seen.add(slug)

    if (!validSlugs.has(slug)) {
      invalidSlugs.push(slug)
      continue
    }

    if (selectedSlugs.length >= COMPARE_MAX_SELECTION) {
      omittedValidSlugs.push(slug)
      continue
    }

    selectedSlugs.push(slug)
  }

  return {
    selectedSlugs,
    invalidSlugs,
    duplicateSlugs,
    omittedValidSlugs,
  }
}

export function serializeCompareSelection(slugs: readonly string[]): string {
  const params = new URLSearchParams()
  const seen = new Set<string>()

  for (const rawSlug of slugs) {
    const slug = rawSlug.trim()
    if (!slug || seen.has(slug)) continue
    seen.add(slug)
    params.append(COMPARE_PARAMETER, slug)
    if (seen.size >= COMPARE_MAX_SELECTION) break
  }

  return params.toString()
}

export function buildCompareHref(slugs: readonly string[]): string {
  const query = serializeCompareSelection(slugs)
  return query ? `${COMPARE_ROUTE}?${query}` : COMPARE_ROUTE
}
