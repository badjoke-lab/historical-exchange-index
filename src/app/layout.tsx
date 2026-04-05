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
        <div className="site-shell">
          <header className="site-header">
            <div>
              <p className="site-kicker">Historical Exchange Index</p>
              <h1 className="site-title">HEI</h1>
            </div>
            <nav className="site-nav">
              <Link href="/">Home</Link>
              <Link href="/dead">Dead</Link>
              <Link href="/active">Active</Link>
              <Link href="/methodology">Methodology</Link>
              <Link href="/about">About</Link>
              <Link href="/donate">Donate</Link>
            </nav>
          </header>

          {children}

          <footer className="site-footer">
            <p>Historical Exchange Index — quiet registry / archive-first / history-first</p>
          </footer>
        </div>
      </body>
    </html>
  )
}
