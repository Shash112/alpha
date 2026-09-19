/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@alpha/ui', '@alpha/config', '@alpha/types'],
  async rewrites() {
    return [
      {
        source: '/c/:publicId',
        destination: '/public-card/:publicId',
      },
    ];
  },
};

module.exports = nextConfig;
