import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/blog'

/**
 * BLOG API ROUTE - All Posts
 * 
 * This API route provides access to all blog posts for client-side fetching.
 * It handles errors gracefully and returns JSON data.
 */

export async function GET() {
  try {
    const posts = await getAllPosts()
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to fetch blog posts', details: errorMessage },
      { status: 500 }
    )
  }
}