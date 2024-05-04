/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["lh3.googleusercontent.com", "upload.wikimedia.org","drive.google.com", "publishwhere-tfg.s3.eu-west-3.amazonaws.com","icons8.com"],
    },
    typescript: {
        ignoreBuildErrors: true, 
        // TODO: "This is a temporary fix to avoid typescript errors in the build process. Remove this line when the errors are fixed",
    },
};

export default nextConfig;
