import type { Metadata } from 'next'
import DonateWalletsClient from '../../components/donate/donate-wallets-client'

export const metadata: Metadata = {
  title: 'Donate',
  description:
    'Support Historical Exchange Index with the published wallet addresses for BTC, ETH, USDT, USDC, SOL, BNB, DOGE, AVAX, and XRP.',
  alternates: {
    canonical: '/donate',
  },
}

export default function DonatePage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">Donate</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>Support HEI</h2>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          HEI includes a public support page for people who want to help maintain and expand the registry.
          Donation support is optional, but it can help sustain the slow work of record building, cleanup,
          archive checks, and record verification.
        </p>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h4>What donations support</h4>
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
              <div className="k">Verification work</div>
              <div className="v">Reviewing dates, causes, and classification details where records remain uncertain.</div>
            </div>
            <div className="fact">
              <div className="k">Maintenance</div>
              <div className="v">Keeping the public registry readable, usable, and up to date over time.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Wallet addresses</h4>
          <p className="muted" style={{ marginTop: 0, lineHeight: 1.75 }}>
            Send only the named asset on the listed network. Double-check address and network before sending.
            Wallet cards below include a copy button for each address.
          </p>

          <DonateWalletsClient />
        </div>

        <div className="section">
          <h4>Notes</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Network caution</div>
              <div className="v">Do not send assets on the wrong network. Funds sent on unsupported networks may be lost.</div>
            </div>
            <div className="fact">
              <div className="k">XRP note</div>
              <div className="v">No destination tag is listed on this page. Confirm your sending service can send without one before using the XRP address.</div>
            </div>
            <div className="fact">
              <div className="k">Final check</div>
              <div className="v">Always verify the copied address on your own device before submitting a transaction.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="callout">
        Support is optional. HEI is intended to remain usable as a public registry regardless of whether you donate.
      </section>
    </main>
  )
}
