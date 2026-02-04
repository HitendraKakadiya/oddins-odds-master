/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@oddins/shared'],
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

