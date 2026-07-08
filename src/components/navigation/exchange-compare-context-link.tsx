'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './exchange-compare-context-link.module.css'

const EXCHANGE_ROUTE = /^\/exchange\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?$/

export default function ExchangeCompareContextLink() {
  const pathname = usePathname()
  const match = pathname.match(EXCHANGE_ROUTE)
  if (!match) return null

  const slug = match[1]

  return (
    <aside className={styles.bar} aria-label="Exchange research actions">
      <span>Research this record across HEI.</span>
      <div className={styles.actions}>
        <Link className="subtle-link" href={`/compare/?exchange=${encodeURIComponent(slug)}`}>
          Compare this exchange
        </Link>
        <Link className="subtle-link" href={`/explore/?view=entities&q=${encodeURIComponent(slug)}`}>
          Open in Explorer
        </Link>
      </div>
    </aside>
  )
}
