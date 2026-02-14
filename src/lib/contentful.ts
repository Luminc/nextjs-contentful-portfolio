import { createClient } from 'contentful'
import { Document } from '@contentful/rich-text-types'
import type {
  ContentfulProject,
  ContentfulPage,
  ContentfulHeroImage,
} from '@/types/contentful'

/**
 * CONTENTFUL CLIENT CONFIGURATION
 *
 * This module provides a centralized Contentful client and data fetching functions.
 * It handles all communication with the Contentful CMS API.
 *
 * Environment Variables Required:
 * - CONTENTFUL_SPACE_ID: Your Contentful space identifier
 * - CONTENTFUL_ACCESS_TOKEN: API token for accessing published content
 */

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

/**
 * DATA FETCHING FUNCTIONS
 * 
 * These functions provide a clean API for fetching different content types from Contentful.
 * They handle the Contentful API complexity and return typed data for use in components.
 */

// Get all projects, ordered by date (newest first)
export const getProjects = async (): Promise<ContentfulProject[]> => {
  const entries = await client.getEntries({
    content_type: 'project',
    order: ['-fields.date'] as any, // Sort by date descending
    include: 3, // Fetch nested content (sections, metadataSections, etc.)
  })

  return entries.items as any as ContentfulProject[]
}

// Get a single project by its URL slug
export const getProject = async (url: string): Promise<ContentfulProject | null> => {
  const entries = await client.getEntries({
    content_type: 'project',
    'fields.url': url, // Filter by URL field
    limit: 1, // Only need one result
    include: 3, // CRITICAL: Fetch nested sections and metadataSections
  })

  return entries.items.length > 0 ? (entries.items[0] as any as ContentfulProject) : null
}

// Get all pages (used for navigation, sitemaps, etc.)
export const getPages = async (): Promise<ContentfulPage[]> => {
  const entries = await client.getEntries({
    content_type: 'about', // Content type is 'about', not 'page'
    include: 3, // Fetch nested content
  })

  return entries.items as any as ContentfulPage[]
}

// Get a single page by its slug (used for dynamic routing)
export const getPage = async (slug: string): Promise<ContentfulPage | null> => {
  const entries = await client.getEntries({
    content_type: 'about', // Content type is 'about', not 'page'
    'fields.slug': slug, // Filter by slug field
    limit: 1, // Only need one result
    include: 3, // Fetch nested content
  })

  return entries.items.length > 0 ? (entries.items[0] as any as ContentfulPage) : null
}

// Get all hero images (used for homepage carousel)
export const getHeroImages = async (): Promise<ContentfulHeroImage[]> => {
  const entries = await client.getEntries({
    content_type: 'heroImages',
    include: 3, // Fetch nested content
  })

  return entries.items as any as ContentfulHeroImage[]
}

export default client