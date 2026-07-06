import Link from 'next/link'
import type { Metadata } from 'next'
import { loadRegistryUpdates } from '../../lib/data/load-registry-updates'
import type { RegistryUpdateCounts } from '../../lib/types/registry-update'
import { CONTACT_HREF } from '../../lib/site-constants'
import styles from './updates.module.css'

export const metadata: Metadata = {
  title: 'Registry Updates',
  description: 'Reviewed additions, corrections, and milestone updates from the Historical Exchange Index registry.',
  alternates: {
    canonical: '/updates',
    types: {
      'application/feed+json': '/feeds/updates.json',
      'application/rss+xml': '/feeds/updates.xml',
    },
  },
}

function delta(after: number, before: number): string {
  const value = after - before
  return value > 0 ? `+${value}` : String(value)
}

function CountChange({ counts }: { counts: RegistryUpdateCounts }) {
  const items = [
    ['Entities', counts.entities_before, counts.entities_after],
    ['Events', counts.events_before, counts.events_after],
    ['Evidence', counts.evidence_before, counts.evidence_after],
  ] as const

  return (
    <div className={styles.countGrid}>
      {items.map(([label, before, after]) => (
        <div className={styles.countItem} key={label}>
          <span className={styles.countLabel}>{label}</span>
          <strong className={styles.countValue}>{after}</strong>
          <span className={styles.countDelta}>{delta(after, before)}</span>
        </div>
      ))}
    </div>
  )
}

function UpdateTypeLabel({ type }: { type: 'registry_growth' | 'quality_audit' }) {
  return <span className={styles.typeLabel}>{type === 'registry_growth' ? 'Registry growth' : 'Quality audit'}</span>
}

export default function RegistryUpdatesPage() {
  const updates = loadRegistryUpdates()
  const totalAdded = updates.reduce((sum, update) => sum + update.added_entities.length, 0)
  const totalEvidenceAdded = updates.reduce((sum, update) => sum + update.evidence_added, 0)

  return (
    <main className={styles.page}>
      <section className="panel longform-panel">
        <div className={styles.headerRow}>
          <div>
            <p className="muted">Reviewed changelog</p>
            <h2 className={styles.pageTitle}>Registry Updates</h2>
            <p className={styles.lead}>
              Canonical additions and reviewed corrections that have already passed HEI review and repository validation. Internal monitoring signals and unmerged candidates are not published here.
            </p>
          </div>
          <div className={styles.headerActions}>
            <Link className="btn btn-primary" href="/explore/?view=events">Explore reviewed events</Link>
            <a className="btn" href="/feeds/updates.xml">RSS</a>
            <a className="btn" href="/feeds/updates.json">JSON Feed</a>
            <Link className="btn" href="/methodology">Methodology</Link>
            <a className="btn" href={CONTACT_HREF} target="_blank" rel="noreferrer">Submit correction</a>
          </div>
        </div>

        <div className={styles.summaryStrip}>
          <div><span className={styles.summaryLabel}>Published updates</span><strong>{updates.length}</strong></div>
          <div><span className={styles.summaryLabel}>Entities added in listed updates</span><strong>{totalAdded}</strong></div>
          <div><span className={styles.summaryLabel}>Evidence added in listed updates</span><strong>{totalEvidenceAdded}</strong></div>
        </div>
      </section>

      <section className={styles.updateList} aria-label="Registry update history">
        {updates.map((update) => (
          <article className={`panel ${styles.updateCard}`} key={update.id} id={update.id}>
            <div className={styles.updateHeader}>
              <div>
                <div className={styles.updateMeta}><time dateTime={update.date}>{update.date}</time><UpdateTypeLabel type={update.type} /></div>
                <h3>{update.title}</h3>
                <p>{update.summary}</p>
              </div>
              <a className={styles.sourceLink} href={update.source.url} target="_blank" rel="noreferrer">{update.source.label}</a>
            </div>

            <CountChange counts={update.counts} />

            <div className={styles.detailGrid}>
              <div><h4>Added entities</h4>{update.added_entities.length > 0 ? <ul>{update.added_entities.map((entity) => <li key={entity.slug}><Link href={`/exchange/${entity.slug}`}>{entity.name}</Link></li>)}</ul> : <p className="muted">No new entities in this update.</p>}</div>
              <div><h4>Repairs and reviewed changes</h4>{update.repairs.length > 0 ? <ul>{update.repairs.map((repair) => <li key={repair}>{repair}</li>)}</ul> : <p className="muted">No repair notes in this update.</p>}</div>
            </div>

            <div className={styles.evidenceRow}><span>Evidence added</span><strong>{update.evidence_added}</strong></div>
          </article>
        ))}
      </section>
    </main>
  )
}
