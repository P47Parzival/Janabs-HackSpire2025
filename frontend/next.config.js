/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable Turbopack for now as it's causing font loading issues
    turbo: false
  }
};

module.exports = nextConfig; 