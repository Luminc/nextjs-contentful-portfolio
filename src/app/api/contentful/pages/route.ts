import { NextResponse } from 'next/server'
import { createClient } from 'contentful'

/**
 * NEXT.JS API ROUTE - Pages Endpoint
 * 
 * This API route provides a RESTful endpoint for fetching page data from Contentful.
 * It's used for client-side data fetching when you need dynamic content updates.
 * 
 * Route: GET /api/contentful/pages
 * Returns: JSON array of page entries from Contentful
 * 
 * Benefits of API Routes:
 * - Keep sensitive credentials on the server
 * - Enable client-side data fetching
 * - Provide structured error handling
 * - Cache responses for better performance
 */

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export async function GET() {
  try {
    // Fetch the 'about' content type (which appears to be the page content)
    const entries = await client.getEntries({
      content_type: 'about',
    })
    
    // Return JSON response with page data
    return NextResponse.json(entries.items)
  } catch (error) {
    // Structured error handling with details for debugging
    console.error('Error fetching pages:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to fetch pages', details: errorMessage }, 
      { status: 500 }
    )
  }
}