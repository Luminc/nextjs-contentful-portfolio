/**
 * STRUCTURED DATA UTILITIES
 *
 * Generates Schema.org JSON-LD structured data for improved SEO.
 */

import { SanityProject } from '@/types/sanity'
import { siteMetadata } from './site-metadata'

export function generateProjectStructuredData(project: SanityProject) {
  const imageUrl = project.featuredImage?.asset?.url

  return {
    '@context': 'https://schema.org',
    '@type': 'VisualArtwork',
    name: project.title,
    description: project.medium,
    dateCreated: project.date,
    artform: project.type,
    creator: {
      '@type': 'Person',
      name: siteMetadata.author,
      url: siteMetadata.siteUrl,
    },
    ...(imageUrl && {
      image: {
        '@type': 'ImageObject',
        url: imageUrl,
        width: project.featuredImage?.asset?.metadata?.dimensions?.width,
        height: project.featuredImage?.asset?.metadata?.dimensions?.height,
      },
    }),
    url: `${siteMetadata.siteUrl}/projects/${project.url}`,
  }
}

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
      url: siteMetadata.siteUrl,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: `${siteMetadata.siteUrl}/projects`,
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generatePersonStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteMetadata.author,
    description: siteMetadata.description,
    url: siteMetadata.siteUrl,
    email: siteMetadata.email,
    birthDate: '1991',
    nationality: {
      '@type': 'Country',
      name: 'Netherlands',
    },
    jobTitle: 'Visual Artist',
    knowsAbout: [
      'Sculpture',
      'Philosophy',
      'Contemplative Inquiry',
      'Installation Art',
      'Machinic Animism',
    ],
    sameAs: [
      siteMetadata.instagram,
      siteMetadata.github,
      siteMetadata.facebook,
    ],
  }
}
