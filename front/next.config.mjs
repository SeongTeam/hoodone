/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',

    logging: {
        // cache clear : ctrl + shift + R
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;
