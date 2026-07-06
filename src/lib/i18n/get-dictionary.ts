import enCommon from '../../i18n/locales/en/common.json'
import enEnums from '../../i18n/locales/en/enums.json'
import jaCommon from '../../i18n/locales/ja/common.json'
import jaEnums from '../../i18n/locales/ja/enums.json'
import {
  defaultLocale,
  isSupportedLocale,
  type SupportedLocale,
} from '../../i18n/config'

export type TranslationDictionary = Readonly<Record<string, string>>

export type LocaleDictionaryBundle = {
  locale: SupportedLocale
  requestedLocale: string
  fallbackUsed: boolean
  common: TranslationDictionary
  enums: TranslationDictionary
}

const dictionaries: Record<SupportedLocale, {
  common: TranslationDictionary
  enums: TranslationDictionary
}> = {
  en: {
    common: enCommon,
    enums: enEnums,
  },
  ja: {
    common: jaCommon,
    enums: jaEnums,
  },
}

export function resolveLocale(locale: string): SupportedLocale {
  return isSupportedLocale(locale) ? locale : defaultLocale
}

export function getDictionary(locale: string): LocaleDictionaryBundle {
  const resolved = resolveLocale(locale)
  return {
    locale: resolved,
    requestedLocale: locale,
    fallbackUsed: resolved !== locale,
    common: dictionaries[resolved].common,
    enums: dictionaries[resolved].enums,
  }
}

export function translate(
  dictionary: TranslationDictionary,
  key: string,
  fallback?: string,
): string {
  return dictionary[key] ?? fallback ?? key
}
