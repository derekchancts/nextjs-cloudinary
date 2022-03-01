/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com', 'unsplash.com'],
    // formats: ["image/webp"],
  },
}

module.exports = nextConfig
