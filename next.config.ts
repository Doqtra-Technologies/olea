import type { NextConfig } from "next";

// Images and PDFs are served from the WordPress media library.
const wordpress = process.env.WORDPRESS_URL ? new URL(process.env.WORDPRESS_URL) : null;

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    remotePatterns: wordpress ? [new URL("/wp-content/uploads/**", wordpress)] : [],
    // The image optimizer refuses private addresses by default, which rules out a WordPress on this machine.
    dangerouslyAllowLocalIP: wordpress?.hostname === "localhost",
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
