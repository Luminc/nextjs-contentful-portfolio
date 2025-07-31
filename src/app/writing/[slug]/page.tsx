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
  const [backlinks, setBacklinks] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/writing/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Post not found')
        }
        return res.json()
      })
      .then(data => {
        setPost(data)
        // Fetch backlinks if post has any
        if (data.backlinks && data.backlinks.length > 0) {
          return fetch(`/api/writing/backlinks/${slug}`)
            .then(res => res.ok ? res.json() : [])
            .then(backlinkData => {
              setBacklinks(backlinkData)
              setLoading(false)
            })
        } else {
          setLoading(false)
        }
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
              <Link href="/writing" className="btn btn-primary">
                ← Back to Writing
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
        <h1 className="text-center display-1 py-2">
          {post.title}
        </h1>
      </Container>
      <div className="blog-page">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8}>
              {/* Back navigation */}
              <div className="mb-5">
                <Link href="/writing" className="text-decoration-none" style={{ color: 'rgba(20, 20, 20, 0.5)' }}>
                  ← Back to Writing
                </Link>
              </div>

              {/* Post header */}
              <header className="mb-5">
                
                <div className="d-flex flex-wrap align-items-center mb-4 blog-meta">
                  <span className="me-4">
                    By {post.author}
                  </span>
                  <span className="me-4">
                    {format(new Date(post.date), 'MMMM d, yyyy')}
                  </span>
                  <span>
                    {post.readingTime} min read
                  </span>
                </div>

              </header>

              {/* Post content */}
              <article 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Topics colophon */}
              {post.topics && post.topics.length > 0 && (
                <div className="post-colophon">
                  <h6 className="colophon-heading">Topics</h6>
                  <div className="colophon-topics">
                    {post.topics.map((topic, index) => (
                      <span key={topic}>
                        <Link href={`/writing/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`} className="topic-link">
                          {topic}
                        </Link>
                        {index < post.topics.length - 1 && ', '}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Backlinks section */}
              {backlinks.length > 0 && (
                <div className="post-backlinks">
                  <h6 className="backlinks-heading">Referenced By</h6>
                  <div>
                    {backlinks.map((backlink) => (
                      <div key={backlink.slug} className="backlink-item">
                        <Link href={`/writing/${backlink.slug}`} className="backlink-title">
                          {backlink.title}
                        </Link>
                        {backlink.folderPath && (
                          <span className="backlink-folder">
                            in {backlink.folderPath}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Post footer */}
              <footer className="blog-post-nav">
                <div className="d-flex justify-content-between align-items-center">
                  <Link href="/writing" className="btn">
                    ← All Writing
                  </Link>
                  
                  <div className="blog-meta">
                    Published {format(new Date(post.date), 'MMMM d, yyyy')}
                  </div>
                </div>
              </footer>
            </Col>
          </Row>
        </Container>
      </div>
    </Layout>
  )
}