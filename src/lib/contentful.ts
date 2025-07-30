import { createClient } from 'contentful'
import { Document } from '@contentful/rich-text-types'

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

// TypeScript interfaces for Contentful content types
// Note: These use 'any' for flexibility - could be made more specific for better type safety
export interface ContentfulAsset {
  sys: any // Contentful system metadata (id, contentType, etc.)
  fields: any // Asset-specific fields (file, title, description, etc.)
}

export interface ContentfulProject {
  sys: any // Contentful system metadata
  fields: any // Project-specific fields (title, description, images, etc.)
}

export interface ContentfulPage {
  sys: any // Contentful system metadata  
  fields: any // Page-specific fields (title, content, slug, etc.)
}

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
  })
  
  return entries.items as ContentfulProject[]
}

// Get a single project by its URL slug
export const getProject = async (url: string): Promise<ContentfulProject | null> => {
  const entries = await client.getEntries({
    content_type: 'project',
    'fields.url': url, // Filter by URL field
    limit: 1, // Only need one result
  })
  
  return entries.items.length > 0 ? entries.items[0] as ContentfulProject : null
}

// Get all pages (used for navigation, sitemaps, etc.)
export const getPages = async (): Promise<ContentfulPage[]> => {
  const entries = await client.getEntries({
    content_type: 'page',
  })
  
  return entries.items as ContentfulPage[]
}

// Get a single page by its slug (used for dynamic routing)
export const getPage = async (slug: string): Promise<ContentfulPage | null> => {
  const entries = await client.getEntries({
    content_type: 'page',
    'fields.slug': slug, // Filter by slug field
    limit: 1, // Only need one result
  })
  
  return entries.items.length > 0 ? entries.items[0] as ContentfulPage : null
}

export default client