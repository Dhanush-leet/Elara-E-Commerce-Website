/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/api/signup",
        destination: "http://localhost:5000/api/signup",
      },
      {
        source: "/api/checkout",
        destination: "http://localhost:5000/api/checkout",
      },
    ];
  },
};

export default nextConfig;
