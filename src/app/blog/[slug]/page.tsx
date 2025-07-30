import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from '@/components/layout'
import { getPost, getAllPosts } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * INDIVIDUAL BLOG POST PAGE
 * 
 * This page displays a single blog post with:
 * - Dynamic metadata for SEO
 * - Full markdown content rendered as HTML
 * - Post metadata and navigation
 * - Responsive typography
 * - Back to blog navigation
 */

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author || 'Jeroen Kortekaas'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    }
  }
}

// Generate static paths for all blog posts (for optimization)
export async function generateStaticParams() {
  const posts = await getAllPosts()
  
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <Layout>
      <Container>
        <Row className="justify-content-center">
          <Col lg={8}>
            {/* Back navigation */}
            <div className="mb-4">
              <Link href="/blog" className="text-decoration-none text-muted">
                ← Back to Blog
              </Link>
            </div>

            {/* Post header */}
            <header className="mb-5">
              <h1 className="display-4 fw-bold text-dark lh-sm mb-3">
                {post.title}
              </h1>
              
              <div className="d-flex flex-wrap align-items-center text-muted mb-4">
                <span className="me-3">
                  By {post.author}
                </span>
                <span className="me-3">
                  {format(new Date(post.date), 'MMMM d, yyyy')}
                </span>
                <span>
                  {post.readingTime} min read
                </span>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="badge bg-light text-dark me-2 mb-1"
                      style={{ fontSize: '0.85rem' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* Post content */}
            <article 
              className="blog-content lh-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{
                fontSize: '1.1rem',
                color: '#333'
              }}
            />

            {/* Post footer */}
            <footer className="border-top pt-4 mt-5">
              <div className="d-flex justify-content-between align-items-center">
                <Link href="/blog" className="btn btn-outline-primary">
                  ← All Posts
                </Link>
                
                <div className="text-muted small">
                  Published {format(new Date(post.date), 'MMMM d, yyyy')}
                </div>
              </div>
            </footer>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}