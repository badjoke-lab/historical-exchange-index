import {
  defaultLocale,
  isPublicLocale,
  isSupportedLocale,
  type SupportedLocale,
} from '../../i18n/config'

function normalizePathname(pathname: string): string {
  const withoutQuery = pathname.split('?')[0] || '/'
  const leading = withoutQuery.startsWith('/') ? withoutQuery : `/${withoutQuery}`
  if (leading === '/') return '/'
  return leading.endsWith('/') ? leading : `${leading}/`
}

export function buildLocalePath(pathname: string, locale: SupportedLocale): string {
  const normalized = normalizePathname(pathname)
  if (locale === defaultLocale) return normalized
  return normalized === '/'
    ? `/${locale}/`
    : `/${locale}${normalized}`
}

export function buildPublicLocalePath(pathname: string, locale: string): string {
  if (!isSupportedLocale(locale)) {
    throw new Error(`Unsupported locale: ${locale}`)
  }
  if (!isPublicLocale(locale)) {
    throw new Error(`Locale is not publicly routed yet: ${locale}`)
  }
  return buildLocalePath(pathname, locale)
}

export function stripLocalePrefix(pathname: string): {
  locale: SupportedLocale
  pathname: string
} {
  const normalized = normalizePathname(pathname)
  for (const locale of ['ja'] as const) {
    if (normalized === `/${locale}/`) {
      return { locale, pathname: '/' }
    }
    if (normalized.startsWith(`/${locale}/`)) {
      return {
        locale,
        pathname: normalizePathname(normalized.slice(locale.length + 1)),
      }
    }
  }
  return { locale: defaultLocale, pathname: normalized }
}
