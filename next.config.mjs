/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.ibb.co'],
  },
  env: {
    ROOT_URL: process.env.NEXT_PUBLIC_ROOT_URL,
  },
};

export default nextConfig;
