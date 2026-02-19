/**
 * ROBOTS.TXT CONFIGURATION
 *
 * Defines crawling rules for search engine bots.
 * This tells search engines which pages they can and cannot access.
 *
 * Configuration:
 * - Allow all bots to crawl the site
 * - Block API routes (not needed in search results)
 * - Block "thanks" page (confirmation page, not useful in search)
 * - Reference the sitemap for efficient crawling
 */

import { MetadataRoute } from 'next'
import { siteMetadata } from '@/lib/site-metadata'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/thanks'],
      },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'anthropic-ai', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
      { userAgent: 'cohere-ai', allow: '/' },
      { userAgent: 'Amazonbot', allow: '/' },
    ],
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}
