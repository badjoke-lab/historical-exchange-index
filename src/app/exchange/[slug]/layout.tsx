import type { ReactNode } from 'react'
import { buildDetailView } from '../../../lib/data/build-detail-view'
import ExchangeMaterialConcerns from '../../../components/exchange-material-concerns'
import styles from './dossier-heading.module.css'

type DossierLayoutProps = {
  children: ReactNode
  params: Promise<{ slug: string }>
}

export default async function DossierLayout({ children, params }: DossierLayoutProps) {
  const { slug } = await params
  const detail = buildDetailView(slug)
  const title = detail?.entity.canonical_name ?? 'Entry not found'

  return (
    <div className={styles.scope}>
      <section className={`panel ${styles.headingPanel}`}>
        <p className="muted">Exchange record</p>
        <h1>{title}</h1>
      </section>
      {detail ? <ExchangeMaterialConcerns entity={detail.entity} events={detail.events} evidence={detail.evidence} /> : null}
      {children}
    </div>
  )
}
