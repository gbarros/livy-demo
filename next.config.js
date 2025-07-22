/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_LIVY_API_KEY: process.env.NEXT_PUBLIC_LIVY_API_KEY,
    LIVY_BASE_URL: process.env.LIVY_BASE_URL,
    SEQ_SERVICE_ID: process.env.SEQ_SERVICE_ID,
    TIME_SERVICE_ID: process.env.TIME_SERVICE_ID,
    COIN_SERVICE_ID: process.env.COIN_SERVICE_ID,
    PRICE_SERVICE_ID: process.env.PRICE_SERVICE_ID,
  },
}

module.exports = nextConfig 