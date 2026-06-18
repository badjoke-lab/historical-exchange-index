import { execFileSync } from 'node:child_process'
import type { NextConfig } from 'next'

let publicOutputPrepared = false

const nextConfig = (): NextConfig => {
  if (!publicOutputPrepared) {
    execFileSync(process.execPath, ['scripts/build-machine-readable-layer.mjs'], {
      cwd: process.cwd(),
      stdio: 'inherit',
    })
    publicOutputPrepared = true
  }

  return {
    reactStrictMode: true,
    output: 'export',
    trailingSlash: true,
  }
}

export default nextConfig
