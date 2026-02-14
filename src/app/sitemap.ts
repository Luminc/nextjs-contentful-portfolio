/**
 * DYNAMIC SITEMAP GENERATION
 *
 * Generates sitemap.xml automatically from Contentful content.
 * This helps search engines discover and index all pages on the site.
 *
 * The sitemap includes:
 * - Homepage
 * - Projects listing page
 * - Individual project pages (dynamic from Contentful)
 * - Dynamic pages (about, etc. from Contentful)
 *
 * Automatically updated when content changes in Contentful.
 */

import { MetadataRoute } from 'next'
import { getProjects, getPages } from '@/lib/contentful'
import { siteMetadata } from '@/lib/site-metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all projects and pages from Contentful
  const [projects, pages] = await Promise.all([
    getProjects(),
    getPages(),
  ])

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1.0,
    },
    {
      url: `${siteMetadata.siteUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // Dynamic project routes
  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteMetadata.siteUrl}/projects/${project.fields.url}`,
    lastModified: new Date(project.sys.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  // Dynamic page routes (about, etc.)
  const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${siteMetadata.siteUrl}/${page.fields.slug}`,
    lastModified: new Date(page.sys.updatedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...pageRoutes]
}
