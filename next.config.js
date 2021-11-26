/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/products",
        permanent: true,
      },
    ];
  },
};
