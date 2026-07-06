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
  return (
    <span className={styles.typeLabel}>
      {type === 'registry_growth' ? 'Registry growth' : 'Quality audit'}
    </span>
  )
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
              Canonical additions and reviewed corrections that have already passed HEI review and repository validation.
              Internal monitoring signals and unmerged candidates are not published here.
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
          <div>
            <span className={styles.summaryLabel}>Published updates</span>
            <strong>{updates.length}</strong>
          </div>
          <div>
            <span className={styles.summaryLabel}>Entities added in listed updates</span>
            <strong>{totalAdded}</strong>
          </div>
          <div>
            <span className={styles.summaryLabel}>Evidence added in listed updates</span>
            <strong>{totalEvidenceAdded}</strong>
          </div>
        </div>
      </section>

      <section className={styles.updateList} aria-label="Registry update history">
        {updates.map((update) => (
          <article className={`panel ${styles.updateCard}`} key={update.id} id={update.id}>
            <div className={styles.updateHeader}>
              <div>
                <div className={styles.updateMeta}>
                  <time dateTime={update.date}>{update.date}</time>
                  <UpdateTypeLabel type={update.update_type} />
                </div>
                <h3>{update.title}</h3>
                <p>{update.summary}</p>
              </div>
              <a className={styles.anchorLink} href={`#${update.id}`} aria-label={`Link to ${update.title}`}>#</a>
            </div>

            <CountChange counts={update.counts} />

            {update.added_entities.length > 0 ? (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeading}>
                  <h4>Added</h4>
                  <span>{update.added_entities.length} entities</span>
                </div>
                <div className={styles.tableWrap}>
                  <table className={styles.entityTable}>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {update.added_entities.map((entity) => (
                        <tr key={entity.slug}>
                          <td><Link href={`/exchange/${entity.slug}`}>{entity.name}</Link></td>
                          <td><span className={styles.neutralChip}>{entity.type ?? '—'}</span></td>
                          <td><span className={`${styles.statusChip} ${styles[`status_${entity.status ?? 'unknown'}`]}`}>{entity.status ?? 'unknown'}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : null}

            {update.updated_entities.length > 0 ? (
              <div className={styles.sectionBlock}>
                <div className={styles.sectionHeading}>
                  <h4>Updated</h4>
                  <span>{update.updated_entities.length} entities</span>
                </div>
                <div className={styles.updatedList}>
                  {update.updated_entities.map((entity) => (
                    <div className={styles.updatedItem} key={entity.slug}>
                      <Link href={`/exchange/${entity.slug}`}>{entity.name}</Link>
                      <p>{entity.change}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {update.notes.length > 0 ? (
              <div className={styles.notesBlock}>
                <h4>Notes</h4>
                <ul>
                  {update.notes.map((note) => <li key={note}>{note}</li>)}
                </ul>
              </div>
            ) : null}
          </article>
        ))}
      </section>

      <section className="callout">
        Registry Updates and its RSS/JSON feeds only cover reviewed public changes. Monitoring candidates, unresolved watchlist items, and raw risk signals remain outside these public outputs until separately reviewed.
      </section>
    </main>
  )
}
