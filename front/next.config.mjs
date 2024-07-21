/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    logging : {
        // cache clear : ctrl + shift + R  
        fetches: {
            fullUrl: true,
        }
    }
};

export default nextConfig;