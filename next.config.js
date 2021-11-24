/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    minimumCacheTTL: 60,
    domains: ["www.publicdomainpictures.net", "www.thelist.com", "cdn.mos.cms.futurecdn.net"],
  },
};
