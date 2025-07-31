import { NextResponse } from 'next/server'
import { getBacklinksForPost } from '@/lib/blog'

/**
 * API route for getting backlinks for a specific post
 * GET /api/writing/backlinks/[slug]
 */
export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    
    // Get backlinks for the post
    const backlinks = await getBacklinksForPost(slug)
    
    return NextResponse.json(backlinks)
  } catch (error) {
    console.error('Error fetching backlinks:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch backlinks', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch backlinks' },
      { status: 500 }
    )
  }
}