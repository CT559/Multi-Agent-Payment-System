/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    return config
  },
  // Next.js 15: silence punycode deprecation from WalletConnect internals
  experimental: {
    serverComponentsExternalPackages: ['pino', 'pino-pretty'],
  },
}
module.exports = nextConfig
