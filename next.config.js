/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  webpack5: true,
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
      stream: false,
      path: false,
      os: false,
      querystring: false,
      http: false,
      https: false,
      crypto: false,
      zlib: false,
      tls: false,
      net: false,
      constants: false,
      child_process: false,
      standalone: false
    };

    return config;
  },
};
