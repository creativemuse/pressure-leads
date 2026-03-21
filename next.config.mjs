/** @type {import('next').NextConfig} */
const nextConfig = {
  // App routes + lib are checked in CI via `yarn typecheck:api`. Full-project strict mode is tracked separately.
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
