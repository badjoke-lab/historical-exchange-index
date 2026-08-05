import type { Metadata } from 'next'
import DonateWalletsClient from '../../components/donate/donate-wallets-client'

export const metadata: Metadata = {
  title: 'Support HEI',
  description:
    'Support Historical Exchange Index record verification, archive checks, corrections, public data, and long-term maintenance.',
  alternates: {
    canonical: '/donate',
    languages: {
      en: '/donate/',
      ja: '/ja/donate/',
    },
  },
}

export default function DonatePage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">Support</p>
        <h1 style={{ marginTop: 0, fontSize: '34px' }}>Support HEI</h1>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          Optional support helps maintain and expand the public registry. It can sustain the slow work of record
          building, archive checks, source review, corrections, machine-readable publishing, and long-term maintenance.
        </p>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h2>What support funds</h2>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Record expansion</div>
              <div className="v">Adding more entities, events, and evidence across active-side and dead-side entries.</div>
            </div>
            <div className="fact">
              <div className="k">Archive coverage</div>
              <div className="v">Improving archived URL coverage and safer historical linking.</div>
            </div>
            <div className="fact">
              <div className="k">Verification and corrections</div>
              <div className="v">Reviewing dates, causes, classifications, sources, and submitted corrections.</div>
            </div>
            <div className="fact">
              <div className="k">Public maintenance</div>
              <div className="v">Maintaining the website, public data files, monitoring, and visual review workflows.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Support options</h2>
          <p className="muted" style={{ marginTop: 0, lineHeight: 1.75 }}>
            Send only the named asset on the listed network. Double-check the asset, chain, and address before sending.
            Primary options are shown first; less common networks remain collapsed until needed.
          </p>
          <DonateWalletsClient locale="en" />
        </div>

        <div className="section">
          <h2>Editorial independence</h2>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">What support does not buy</div>
              <div className="v">Support does not guarantee inclusion, removal, status changes, rankings, or favorable descriptions.</div>
            </div>
            <div className="fact">
              <div className="k">Evidence standards</div>
              <div className="v">Evidence and review requirements remain the same regardless of who provides support.</div>
            </div>
            <div className="fact">
              <div className="k">Corrections remain open</div>
              <div className="v">Corrections are reviewed whether or not the submitter has supported HEI.</div>
            </div>
            <div className="fact">
              <div className="k">Final transaction check</div>
              <div className="v">Verify every copied address and network on your own device before submitting a transaction.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="callout">
        Support is optional. It does not affect record selection, classification, evidence standards, corrections,
        or editorial decisions. HEI remains a public registry regardless of whether you provide support.
      </section>
    </main>
  )
}
