import Link from 'next/link'
import styles from './related-surface-links.module.css'

export interface RelatedSurfaceLink {
  href: string
  label: string
}

export default function RelatedSurfaceLinks({ links }: { links: RelatedSurfaceLink[] }) {
  return (
    <nav className={styles.related} aria-label="Related HEI surfaces">
      <span className={styles.label}>Related views</span>
      <div className={styles.links}>
        {links.map((link) => (
          <Link className="btn" href={link.href} key={link.href}>
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
