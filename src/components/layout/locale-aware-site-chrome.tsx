'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { stripLocalePrefix } from '../../lib/i18n/locale-routes'
import SiteChrome from './site-chrome'

type LocaleAwareSiteChromeProps = {
  children: ReactNode
}

export default function LocaleAwareSiteChrome({ children }: LocaleAwareSiteChromeProps) {
  const pathname = usePathname()
  const { locale } = stripLocalePrefix(pathname)

  return <SiteChrome locale={locale}>{children}</SiteChrome>
}
