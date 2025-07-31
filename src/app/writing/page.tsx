'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * BLOG INDEX PAGE
 * 
 * This page displays all published blog posts from the Obsidian vault.
 * Features:
 * - Client-side rendering with optimized caching
 * - Responsive card layout
 * - Post metadata (date, reading time, tags)
 * - Graceful handling when no posts exist
 */

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/writing')
      .then(res => res.json())
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Layout pageTitle="Writing">
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

  if (error) {
    return (
      <Layout pageTitle="Writing">
        <Container>
          <div className="alert alert-danger" role="alert">
            Error loading posts: {error}
          </div>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Writing">
      <div className="blog-page">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={10} className="text-center">
              <h1 className="display-1 mb-4">Writing</h1>
              <p className="lead" style={{ fontSize: '1.3rem', color: 'rgba(20, 20, 20, 0.7)' }}>
                Philosophical explorations, contemplative fragments, and interconnected thoughts from the dark-intelligibility vault.
              </p>
              <div className="d-flex justify-content-center gap-3 mt-4">
                <Link href="/writing/vault" className="btn btn-outline-dark">
                  📁 Explore Vault
                </Link>
              </div>
            </Col>
          </Row>

          {posts.length === 0 ? (
            <Row className="justify-content-center text-center py-5">
              <Col lg={8}>
                <h2 className="h4 mb-4">No Posts Available</h2>
                <p className="lead text-muted mb-4">
                  The writing vault appears to be empty or the dark-intelligibility repository hasn&apos;t been initialized yet.
                </p>
              </Col>
            </Row>
          ) : (
            <div className="blog-index">
              <Row className="gy-4">
                {posts.map((post) => (
                  <Col lg={6} key={post.slug}>
                    <Card className="h-100 blog-card shadow-sm">
                      <Card.Body className="d-flex flex-column">
                        <div className="mb-3">
                          <Card.Title className="h4 mb-2">
                            <Link href={`/writing/${post.slug}`} className="text-decoration-none">
                              {post.title}
                            </Link>
                          </Card.Title>
                          <div className="blog-meta small text-muted mb-3">
                            {format(new Date(post.date), 'MMMM d, yyyy')} • {post.readingTime}min read
                            {post.folderPath && (
                              <>
                                {' • '}
                                <Link 
                                  href={`/writing/folder/${encodeURIComponent(post.folderPath)}`}
                                  className="text-muted text-decoration-none"
                                >
                                  📁 {post.folderPath}
                                </Link>
                              </>
                            )}
                            {post.backlinks && post.backlinks.length > 0 && (
                              <> • {post.backlinks.length} connection{post.backlinks.length !== 1 ? 's' : ''}</>
                            )}
                          </div>
                        </div>
                        
                        <Card.Text className="flex-grow-1 mb-3">
                          {post.excerpt}
                        </Card.Text>

                        {post.topics && post.topics.length > 0 && (
                          <div className="mt-auto">
                            <div className="d-flex flex-wrap gap-1">
                              {post.topics.slice(0, 3).map((topic) => (
                                <Link
                                  key={topic}
                                  href={`/writing/topic/${topic.toLowerCase().replace(/\s+/g, '-')}`}
                                  className="badge bg-light text-dark text-decoration-none"
                                  style={{ fontSize: '0.75rem' }}
                                >
                                  {topic}
                                </Link>
                              ))}
                              {post.topics.length > 3 && (
                                <span className="badge bg-light text-muted" style={{ fontSize: '0.75rem' }}>
                                  +{post.topics.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}
        </Container>
      </div>
    </Layout>
  )
}