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
    let backendUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!backendUrl || backendUrl === "undefined" || backendUrl === "null") {
      backendUrl = "http://localhost:5000";
    }
    // Strip any accidental trailing slashes from the URL
    backendUrl = backendUrl.replace(/\/$/, "");

    return [
      {
        source: "/api/signup",
        destination: `${backendUrl}/api/signup`,
      },
      {
        source: "/api/checkout",
        destination: `${backendUrl}/api/checkout`,
      },
      {
        source: "/api/checkout/verify",
        destination: `${backendUrl}/api/checkout/verify`,
      }
    ];
  },
};

export default nextConfig;
