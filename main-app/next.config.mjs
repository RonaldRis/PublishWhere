import path from 'path';
import { fileURLToPath } from 'url';

// Obtiene el nombre del archivo y el nombre del directorio
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "upload.wikimedia.org",
      "drive.google.com",
      "publishwhere-tfg.s3.eu-west-3.amazonaws.com",
      "icons8.com",
      "yt3.ggpht.com",
      "pbs.twimg.com"
    ],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@/app': path.resolve(__dirname, 'src/app'),
      '@/assets': path.resolve(__dirname, 'src/assets'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/contexts': path.resolve(__dirname, 'src/contexts'),
      '@/lib': path.resolve(__dirname, 'src/lib'),
    };
    return config;
  }
};

export default nextConfig;
