import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'

type RootLayoutProps = {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <div className="page">
          <header className="topbar">
            <div className="brand">
              <div className="brand-mark">HEI</div>
              <div className="brand-copy">
                <h1>Historical Exchange Index</h1>
                <p>A quiet registry of crypto exchanges, active and gone.</p>
              </div>
            </div>

            <nav className="nav">
              <Link href="/">Home</Link>
              <Link href="/dead">Dead</Link>
              <Link href="/active">Active</Link>
              <Link href="/methodology">Methodology</Link>
              <Link href="/about">About</Link>
              <Link className="utility" href="/donate">Donate</Link>
            </nav>
          </header>

          {children}

          <footer className="footer">
            <div>Historical Exchange Index — quiet registry / archive-first / history-first</div>
            <div>
              <Link className="archive-link" href="/donate">Support HEI</Link>
              <span className="muted"> · </span>
              <Link href="/about">About</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
