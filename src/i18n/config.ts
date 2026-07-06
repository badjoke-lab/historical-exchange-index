export const defaultLocale = 'en' as const

export const supportedLocales = ['en', 'ja'] as const

export const publicLocales = ['en'] as const

export type SupportedLocale = (typeof supportedLocales)[number]
export type PublicLocale = (typeof publicLocales)[number]

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale)
}

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale)
}
