import { NextResponse } from 'next/server'
import { getPost } from '@/lib/blog'

/**
 * BLOG API ROUTE - Individual Post
 * 
 * This API route provides access to individual blog posts by slug.
 * It handles errors gracefully and returns appropriate HTTP status codes.
 */

interface RouteParams {
  params: {
    slug: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const post = await getPost(params.slug)
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error(`Error fetching blog post ${params.slug}:`, error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to fetch blog post', details: errorMessage },
      { status: 500 }
    )
  }
}