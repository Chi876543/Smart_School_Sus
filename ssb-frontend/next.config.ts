// ssb-frontend/next.config.js → PHẢI CÓ ĐÚNG DÒNG NÀY
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:3001/:path*", // ← backend đang chạy ở 3001
      },
    ];
  },
};

module.exports = nextConfig;