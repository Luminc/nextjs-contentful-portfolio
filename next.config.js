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
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io', // Sanity image & file CDN
        port: '',
        pathname: '/**',
      },
    ],
    // Enable image optimization with caching
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache images for 7 days
    formats: ['image/webp', 'image/avif'], // Modern formats for better compression
    deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Smaller sizes for icons/thumbnails
    dangerouslyAllowSVG: false, // Security: disable SVG remote images
    contentDispositionType: 'inline', // Serve images inline
  },
  // Compiler optimizations
  compiler: {
    styledComponents: true, // Enable styled-components compilation
  },
}

module.exports = nextConfig