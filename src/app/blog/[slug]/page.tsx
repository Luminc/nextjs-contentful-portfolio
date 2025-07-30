'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Container, Row, Col } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * INDIVIDUAL BLOG POST PAGE
 * 
 * This page displays a single blog post with:
 * - Client-side rendering with loading states
 * - Full markdown content rendered as HTML
 * - Post metadata and navigation
 * - Responsive typography
 * - Back to blog navigation
 */

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/blog/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Post not found')
        }
        return res.json()
      })
      .then(data => {
        setPost(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <Layout>
        <Container>
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </Layout>
    )
  }

  if (error || !post) {
    return (
      <Layout>
        <Container>
          <Row className="justify-content-center text-center py-5">
            <Col lg={8}>
              <h1 className="display-4 fw-bold text-dark mb-4">
                Post Not Found
              </h1>
              <p className="lead text-muted mb-4">
                The blog post you&apos;re looking for doesn&apos;t exist or has been moved.
              </p>
              <Link href="/blog" className="btn btn-primary">
                ← Back to Blog
              </Link>
            </Col>
          </Row>
        </Container>
      </Layout>
    )
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