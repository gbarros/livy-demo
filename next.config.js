/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    USER_API_KEY: process.env.USER_API_KEY,
    SEQ_SERVICE_ID: process.env.SEQ_SERVICE_ID,
    TIME_SERVICE_ID: process.env.TIME_SERVICE_ID,
    COIN_SERVICE_ID: process.env.COIN_SERVICE_ID,
    PRICE_SERVICE_ID: process.env.PRICE_SERVICE_ID,
  },
}

module.exports = nextConfig 