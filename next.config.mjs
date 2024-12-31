/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['localhost', 'weupla.net']
  },
  api: {
    bodyParser: {
      sizeLimit: '10mb'
    },
    responseLimit: false
  }
};

export default nextConfig;
