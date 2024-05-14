// next.config.js
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["lh3.googleusercontent.com", 
        "upload.wikimedia.org","drive.google.com", 
        "publishwhere-tfg.s3.eu-west-3.amazonaws.com","icons8.com",
        "yt3.ggpht.com",
        "pbs.twimg.com"
    ],
    },
    webpack: (config) => {
        config.resolve.alias['@'] = path.resolve(__dirname, 'src');
        return config;
    }
    
};

export default nextConfig;
