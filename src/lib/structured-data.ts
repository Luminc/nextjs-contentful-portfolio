/**
 * STRUCTURED DATA UTILITIES
 *
 * Generates Schema.org JSON-LD structured data for improved SEO.
 * This helps search engines understand the content and display rich results.
 *
 * Schema.org Types Used:
 * - VisualArtwork: For individual art projects
 * - Person: For artist information
 * - WebSite: For the main site
 */

import { ContentfulProject } from '@/types/contentful'
import { createImageUrl } from './utils'
import { siteMetadata } from './site-metadata'

/**
 * Generates Schema.org structured data for a project page
 * Type: VisualArtwork - represents an artistic work
 *
 * @param project - The Contentful project data
 * @returns Schema.org JSON-LD object
 */
export function generateProjectStructuredData(project: ContentfulProject) {
  const imageUrl = project.fields.featuredImage?.fields?.file?.url
    ? createImageUrl(project.fields.featuredImage.fields.file.url)
    : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: project.fields.title,
    description: project.fields.medium,
    dateCreated: project.fields.date,
    artform: project.fields.type,
    creator: {
      '@type': 'Person',
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: project.fields.featuredImage?.fields?.file?.details?.image?.width,
        height: project.fields.featuredImage?.fields?.file?.details?.image?.height,
      },
    }),
    url: `${siteMetadata.siteUrl}/projects/${project.fields.url}`,
  }
}

/**
 * Generates Schema.org structured data for the website
 * Type: WebSite - represents the entire site
 *
 * @returns Schema.org JSON-LD object
 */
export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteMetadata.title,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    author: {
      '@type': 'Person',
      name: siteMetadata.author,
      email: siteMetadata.email,
    },
  }
}

/**
 * Generates Schema.org structured data for the artist
 * Type: Person - represents the artist/creator
 *
 * @returns Schema.org JSON-LD object
 */
export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteMetadata.author,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    email: siteMetadata.email,
    sameAs: [
      siteMetadata.instagram,
      siteMetadata.github,
      siteMetadata.facebook,
    ],
  }
}
