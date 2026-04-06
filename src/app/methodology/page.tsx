import { CORRECTION_HREF } from '../../lib/site-constants'

export default function MethodologyPage() {
  return (
    <main className="longform">
      <section className="panel longform-panel">
        <p className="muted">Methodology</p>
        <h2 style={{ marginTop: 0, fontSize: '34px' }}>How HEI classifies records</h2>
        <p className="muted" style={{ lineHeight: 1.75, maxWidth: '80ch' }}>
          Historical Exchange Index is a historical registry, not a live ranking product. It tracks exchange
          identity, status shifts, major lifecycle events, URL history, and supporting records in a structured,
          archive-aware format.
        </p>
      </section>

      <section className="panel longform-panel">
        <div className="section" style={{ borderTop: 'none', paddingTop: 0 }}>
          <h4>Core principles</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Registry first</div>
              <div className="v">HEI is designed as a registry, not as a recommendation or ranking surface.</div>
            </div>
            <div className="fact">
              <div className="k">Entity-first</div>
              <div className="v">v0 counts entities, not deployments. Multi-chain deployment splitting is deferred.</div>
            </div>
            <div className="fact">
              <div className="k">Archive-aware</div>
              <div className="v">Dead-side records prefer archived references when live domains are unsafe or repurposed.</div>
            </div>
            <div className="fact">
              <div className="k">Uncertainty visible</div>
              <div className="v">Unknown values are preferred over forced weak conclusions.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Record model</h4>
          <div className="fact-grid">
            <div className="fact">
              <div className="k">Entity</div>
              <div className="v">The exchange itself: identity, aliases, status, dates, origin, domain history.</div>
            </div>
            <div className="fact">
              <div className="k">Event</div>
              <div className="v">Meaningful lifecycle changes: launches, shutdowns, hacks, insolvency, rebrands, acquisitions.</div>
            </div>
            <div className="fact" style={{ gridColumn: '1 / -1' }}>
              <div className="k">Evidence</div>
              <div className="v">Supporting records used to back claims: official references, archival captures, reporting, and notices.</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h4>Status handling</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            HEI separates exchange status from disappearance cause. A record can be dead, merged, acquired,
            rebranded, limited, inactive, or active, while the reason field separately describes why the record
            reached that state.
          </p>
        </div>

        <div className="section">
          <h4>URL handling</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            Original domains are historical records, but not always safe destinations. HEI tracks URL status
            separately and may prefer archived URLs over live domains when the original property has died,
            redirected, been repurposed, or become unsafe.
          </p>
        </div>

        <div className="section">
          <h4>Revision policy</h4>
          <p className="muted" style={{ margin: 0, lineHeight: 1.75 }}>
            Records may be incomplete, approximate, contested, or revised. Dates, causes, and classification
            details can change when stronger evidence becomes available.
          </p>
        </div>

        <div className="section">
          <h4>Corrections</h4>
          <p className="muted" style={{ margin: '0 0 12px', lineHeight: 1.75 }}>
            When a record is wrong or incomplete, the correction path should be used to submit a better record,
            stronger evidence, or a safer URL interpretation.
          </p>
          <a className="btn btn-primary" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
            Submit a correction
          </a>
        </div>
      </section>

      <section className="callout">
        HEI is intentionally conservative. It is better to leave a field uncertain than to overstate a claim
        with weak support.
      </section>
    </main>
  )
}
