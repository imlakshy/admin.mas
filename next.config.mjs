/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "epaerkyotsdbrcsmadfp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
