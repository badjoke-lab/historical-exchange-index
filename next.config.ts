import './scripts/build-machine-readable-layer.mjs'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
}

export default nextConfig
