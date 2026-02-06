/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@oddins/shared'],
  // output: 'standalone',  // Disabled due to Windows symlink issues with pnpm
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig

