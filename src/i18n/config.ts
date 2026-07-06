import localeConfig from '../../config/i18n-locales.json'

export const defaultLocale = localeConfig.default_locale as 'en'
export const fallbackLocale = localeConfig.fallback_locale as 'en'
export const supportedLocales = localeConfig.supported_locales as readonly ['en', 'ja']
export const publicLocales = localeConfig.public_locales as readonly ['en']
export const pilotLocales = localeConfig.pilot_locales as readonly ['ja']

export type SupportedLocale = (typeof supportedLocales)[number]
export type PublicLocale = (typeof publicLocales)[number]
export type PilotLocale = (typeof pilotLocales)[number]

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale)
}

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale)
}

export function isPilotLocale(value: string): value is PilotLocale {
  return pilotLocales.includes(value as PilotLocale)
}
