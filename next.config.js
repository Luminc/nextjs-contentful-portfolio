/** @type {import('next').NextConfig} */
/**
 * NEXT.JS CONFIGURATION
 * 
 * This file configures Next.js features and optimizations for the portfolio site.
 * Key configurations:
 * - Image optimization for Contentful assets
 * - Styled Components support for CSS-in-JS
 */
const nextConfig = {
  // Image optimization configuration
  images: {
    // Allow Next.js Image component to load images from Contentful CDN
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net', // Contentful image CDN
        port: '',
        pathname: '/**', // Allow all paths
      },
      {
        protocol: 'https', 
        hostname: 'videos.ctfassets.net', // Contentful video CDN
        port: '',
        pathname: '/**', // Allow all paths
      },
    ],
  },
  // Compiler optimizations
  compiler: {
    styledComponents: true, // Enable styled-components compilation
  },
}

module.exports = nextConfig