/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
  images: {
    domains: ['images.unsplash.com'],
  },
};

export default nextConfig;
