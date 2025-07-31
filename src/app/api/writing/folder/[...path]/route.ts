import { NextResponse } from 'next/server'
import { getPostsByFolder } from '@/lib/blog'

/**
 * API route for getting posts from a specific folder
 * GET /api/writing/folder/[...path]
 */
export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = params
    const folderPath = Array.isArray(path) ? path.join('/') : path
    
    // Get posts from the specified folder
    const posts = await getPostsByFolder(folderPath)
    
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching folder posts:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to fetch folder posts', details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to fetch folder posts' },
      { status: 500 }
    )
  }
}