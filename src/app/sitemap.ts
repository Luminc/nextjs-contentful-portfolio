import { MetadataRoute } from 'next'
import { getProjects, getPages } from '@/lib/sanity'
import { siteMetadata } from '@/lib/site-metadata'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, pages] = await Promise.all([
    getProjects(),
    getPages(),
  ])

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

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteMetadata.siteUrl}/projects/${project.url}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }))

  const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
    url: `${siteMetadata.siteUrl}/${page.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes, ...pageRoutes]
}
