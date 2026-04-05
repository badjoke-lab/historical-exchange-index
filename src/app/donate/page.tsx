export default function DonatePage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">Donate</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>Support HEI</h2>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          HEI includes a public support page for people who want to help maintain and expand the registry.
          Donation support is optional, but it can help sustain the slow work of record building and cleanup.
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
          <h4>Support methods</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Wallets</div>
              <div className="v">Wallet addresses will be listed here when they are ready.</div>
            </div>
            <div className="fact">
              <div className="k">Status</div>
              <div className="v">Current page is a placeholder for future support rails.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Notes</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            Only send supported assets once addresses are published. Always verify address and network details
            before sending.
          </p>
        </div>
      </section>

      <section className="callout">
        Support is optional. HEI is intended to remain usable as a public registry regardless of whether you donate.
      </section>
    </main>
  )
}
