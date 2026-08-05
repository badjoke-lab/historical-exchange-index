'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { SupportedLocale } from '../../i18n/config'
import styles from './support-strip.module.css'

type Props = {
  locale: SupportedLocale
  href: string
}

export default function SupportStrip({ locale, href }: Props) {
  const pathname = usePathname()
  if (pathname === '/donate' || pathname === '/donate/' || pathname === '/ja/donate' || pathname === '/ja/donate/') {
    return null
  }

  const ja = locale === 'ja'
  return (
    <aside className={styles.strip} aria-labelledby="hei-support-strip-title">
      <div>
        <p className={styles.kicker}>{ja ? '独立した公開台帳' : 'Independent public registry'}</p>
        <h2 id="hei-support-strip-title">{ja ? '公開記録の維持を支援する' : 'Help maintain the public record'}</h2>
        <p>{ja
          ? 'レコード検証、アーカイブ確認、訂正対応、長期保守への任意の支援を受け付けています。支援は掲載や分類、証拠基準に影響しません。'
          : 'Optional support helps with record verification, archive checks, corrections, and long-term maintenance. Support never changes inclusion, classification, or evidence standards.'}</p>
      </div>
      <Link className={styles.action} href={href}>{ja ? 'HEIを支援' : 'Support HEI'}</Link>
    </aside>
  )
}
