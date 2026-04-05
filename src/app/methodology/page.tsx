export default function MethodologyPage() {
  return (
    <main>
      <section className="page-section">
        <p className="muted">Methodology</p>
        <h1>How HEI classifies records</h1>
        <p>
          HEI is a historical registry rather than a live ranking product. It tracks exchange identity,
          status, important lifecycle events, and supporting records in a structured archive-style format.
        </p>
      </section>

      <section className="page-section note-box">
        <h2>Core principles</h2>
        <ul>
          <li>Registry first, not ranking first</li>
          <li>Entity-level counting in v0</li>
          <li>Dead-side records prefer archived references where appropriate</li>
          <li>Unknown values are preferred over forced weak conclusions</li>
          <li>Records may be incomplete or revised</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Record model</h2>
        <ul>
          <li>Entity: the exchange itself</li>
          <li>Event: meaningful lifecycle changes</li>
          <li>Evidence: supporting records for claims</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Status and uncertainty</h2>
        <p>
          HEI separates end-state status from disappearance cause. Dates, causes, and historical claims can
          remain provisional when stronger confirmation is not yet available.
        </p>
      </section>
    </main>
  )
}
