/** @type {import('next').NextConfig} */
const nextConfig = {
    reactCompiler: true,
    // cacheComponents: true,
    experimental: {
        turbopackFileSystemCacheForDev: true,
    },
};

export default nextConfig;
