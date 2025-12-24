/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    // Environment variables for the application
    // LOLABOT_API_URL is the URL of the main LolaBot app that serves the blog API
    env: {
        LOLABOT_API_URL: process.env.LOLABOT_API_URL || 'http://localhost:3000',
    },
    // Expose as public runtime config for server-side rendering
    publicRuntimeConfig: {
        LOLABOT_API_URL: process.env.LOLABOT_API_URL || 'http://localhost:3000',
    },
};

export default nextConfig;
