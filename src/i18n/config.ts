import localeConfig from '../../config/i18n-locales.json'

export type SupportedLocale = 'en' | 'ja'
export type PublicLocale = 'en'
export type PilotLocale = 'ja'

export const defaultLocale: SupportedLocale = localeConfig.default_locale as SupportedLocale
export const fallbackLocale: SupportedLocale = localeConfig.fallback_locale as SupportedLocale
export const supportedLocales = localeConfig.supported_locales as SupportedLocale[]
export const publicLocales = localeConfig.public_locales as PublicLocale[]
export const pilotLocales = localeConfig.pilot_locales as PilotLocale[]

export function isSupportedLocale(value: string): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale)
}

export function isPublicLocale(value: string): value is PublicLocale {
  return publicLocales.includes(value as PublicLocale)
}

export function isPilotLocale(value: string): value is PilotLocale {
  return pilotLocales.includes(value as PilotLocale)
}
