import './scripts/build-machine-readable-layer.mjs'
import './scripts/build-record-level-machine-readable.mjs'
import './scripts/register-stats-machine-readable.mjs'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
}

export default nextConfig
