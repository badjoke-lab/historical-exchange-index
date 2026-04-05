export default function AboutPage() {
  return (
    <main>
      <section className="page-section">
        <p className="muted">About</p>
        <h1>Why HEI exists</h1>
        <p>
          Historical Exchange Index exists to keep exchange identity, status shifts, major lifecycle events,
          and supporting records in one place.
        </p>
      </section>

      <section className="page-section">
        <h2>What HEI is</h2>
        <p>
          A quiet, structured registry of crypto exchange history. It is designed for browsing and reference,
          not hype, trading prompts, or leaderboards.
        </p>
      </section>

      <section className="page-section">
        <h2>What HEI is not</h2>
        <ul>
          <li>Not a trading platform</li>
          <li>Not a price dashboard</li>
          <li>Not an exchange recommendation engine</li>
          <li>Not investment advice</li>
        </ul>
      </section>

      <section className="page-section note-box">
        <h2>Project direction</h2>
        <p>
          HEI favors archival structure, readable records, and visible uncertainty over growth-style product
          presentation.
        </p>
      </section>
    </main>
  )
}
