/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    MONGO_DB_URI: "mongodb://localhost:27017"
  }
}
