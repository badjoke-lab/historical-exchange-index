import './globals.css'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { CORRECTION_HREF } from '../lib/site-constants'

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
              <Link className="nav-link" href="/">Home</Link>
              <Link className="nav-link" href="/dead">Dead</Link>
              <Link className="nav-link" href="/active">Active</Link>
              <Link className="nav-link nav-secondary" href="/methodology">Methodology</Link>
              <Link className="nav-link nav-secondary" href="/about">About</Link>
              <Link className="utility" href="/donate">Donate</Link>
            </nav>
          </header>

          {children}

          <footer className="footer">
            <div className="footer-copy">Historical Exchange Index — quiet registry / archive-first / history-first</div>
            <div className="footer-links">
              <a className="archive-link" href={CORRECTION_HREF} target="_blank" rel="noreferrer">
                Corrections
              </a>
              <span className="muted footer-sep"> · </span>
              <Link className="archive-link" href="/donate">Support HEI</Link>
              <span className="muted footer-sep"> · </span>
              <Link href="/about">About</Link>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
