/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    // Pass environment variables to the app
    env: {
        LOLABOT_API_URL: process.env.LOLABOT_API_URL || 'http://localhost:3000',
    },
};

export default nextConfig;
