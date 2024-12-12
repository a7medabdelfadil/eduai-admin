/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_COMETCHAT_APP_ID: process.env.NEXT_PUBLIC_COMETCHAT_APP_ID,
    NEXT_PUBLIC_COMETCHAT_REGION: process.env.NEXT_PUBLIC_COMETCHAT_REGION,
    NEXT_PUBLIC_COMETCHAT_AUTH_KEY: process.env.NEXT_PUBLIC_COMETCHAT_AUTH_KEY,
  },
};

export default nextConfig;
