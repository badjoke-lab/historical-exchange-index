import type { ReactNode } from 'react'
import { buildDetailView } from '../../../lib/data/build-detail-view'
import ExchangeMaterialConcerns from '../../../components/exchange-material-concerns'
import styles from './dossier-heading.module.css'

type DossierLayoutProps = {
  children: ReactNode
  params: Promise<{ slug: string }>
}

const izakayaRelatedRecords = [
  { href: 'https://cya.badjoke-lab.com/platform/izaka-ya/', name: 'Crypto Yield Archive — IZAKA-YA', note: 'Lending / yield platform record for the IZAKA-YA service.' },
  { href: 'https://www.stableorgone.com/stablecoin/jpyr/', name: 'Stable or Gone — JPYR', note: 'Stable-asset record for JPYR and its reviewed backing / redemption uncertainty.' },
  { href: 'https://wlr.badjoke-lab.com/wallet/izaka-ya-wallet/', name: 'Wallet Lifecycle Registry — IZAKA-YA Wallet', note: 'Wallet and custody lifecycle record for the IZAKA-YA wallet service.' },
]

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
      {slug === 'izaka-ya' ? (
        <section className="panel longform-panel">
          <div className="section">
            <h4>Related registry records</h4>
            <p className="muted">These are separate public records concerning the same IZAKA-YA / JPYR product ecosystem. The links do not assert common legal ownership, issuer status, custody, or safety.</p>
            <div className="fact-grid">
              {izakayaRelatedRecords.map((record) => (
                <div className="fact" key={record.href}>
                  <div className="k">Ledger Series</div>
                  <div className="v"><a className="subtle-link" href={record.href} target="_blank" rel="noreferrer">{record.name}</a><br/><span className="muted">{record.note}</span></div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      {children}
    </div>
  )
}