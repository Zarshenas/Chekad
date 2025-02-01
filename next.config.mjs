/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // Disable default image optimization
  },
  assetPrefix: isProd ? "/your-repository-name/" : "",
  basePath: isProd ? "/your-repository-name" : "",
};

export default nextConfig;
