/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  output: "export",
  basePath: '/knr25_score',
  assetPrefix: '/knr25_score/',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
