export default function DonatePage() {
  return (
    <main>
      <section className="page-section">
        <p className="muted">Donate</p>
        <h1>Support HEI</h1>
        <p>
          HEI includes a public support page for people who want to help maintain and expand the registry.
        </p>
      </section>

      <section className="page-section note-box">
        <h2>What donations support</h2>
        <ul>
          <li>Record expansion</li>
          <li>Archive coverage</li>
          <li>Verification and cleanup</li>
          <li>Detail-page improvement</li>
          <li>Long-term maintenance</li>
        </ul>
      </section>

      <section className="page-section">
        <h2>Support methods</h2>
        <p>Wallet addresses and support methods will be listed here when they are ready.</p>
      </section>

      <section className="page-section">
        <h2>Notes</h2>
        <ul>
          <li>Donation support is optional.</li>
          <li>Only send supported assets once addresses are published.</li>
          <li>Always verify address and network details before sending.</li>
        </ul>
      </section>
    </main>
  )
}
