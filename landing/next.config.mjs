/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    reactStrictMode: true,
    typescript: {
        ignoreBuildErrors: true,
    },
    // Environment variables for the application
    // NEXT_PUBLIC_LOLABOT_API_URL is the URL of the main LolaBot app that serves the blog API
    env: {
        NEXT_PUBLIC_LOLABOT_API_URL: process.env.NEXT_PUBLIC_LOLABOT_API_URL || 'http://localhost:3000',
    },
    // Expose as public runtime config for server-side rendering
    publicRuntimeConfig: {
        NEXT_PUBLIC_LOLABOT_API_URL: process.env.NEXT_PUBLIC_LOLABOT_API_URL || 'http://localhost:3000',
    },
};

export default nextConfig;
