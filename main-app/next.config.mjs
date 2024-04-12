/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "upload.wikimedia.org","drive.google.com", "publishwhere-tfg.s3.eu-west-3.amazonaws.com","icons8.com"],
    },
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback.fs = false;
        }
        return config;
    },
};

export default nextConfig;
