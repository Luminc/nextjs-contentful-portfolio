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
 * - Client-side rendering with loading states
 * - Responsive card layout
 * - Post metadata (date, reading time, tags)
 * - Graceful handling when no posts exist
 */

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/blog')
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
            Error loading blog posts: {error}
          </div>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Writing">
      <div className="blog-page">
        <Container>
          {posts.length === 0 ? (
            <Row className="justify-content-center text-center py-5">
              <Col lg={8}>
                <p className="lead text-muted mb-4">
                  No blog posts available yet. The blog content will appear here once the Obsidian vault is connected.
                </p>
                <div className="alert alert-info">
                  <strong>Development Note:</strong> Initialize the git submodule with your Obsidian vault to see blog posts.
                  <br />
                  <code>git submodule add [your-blog-repo-url] src/content/blog</code>
                </div>
              </Col>
            </Row>
          ) : (
            <div className="blog-index">
              <Row className="justify-content-center mb-5">
                <Col lg={8} className="text-center">
                  <p className="lead" style={{ fontSize: '1.3rem', color: 'rgba(20, 20, 20, 0.7)' }}>
                    Philosophical reflections and artistic explorations from the intersection of design and technology.
                  </p>
                </Col>
              </Row>
              
              <Row>
                {posts.map((post) => (
                  <Col key={post.slug} lg={6} className="mb-5">
                    <Card className="blog-card h-100">
                      <Card.Body className="d-flex flex-column p-4">
                        <div className="blog-meta mb-3">
                          {format(new Date(post.date), 'MMMM d, yyyy')} • {post.readingTime} min read
                        </div>
                        
                        <Card.Title className="card-title mb-3">
                          <Link href={`/blog/${post.slug}`}>
                            {post.title}
                          </Link>
                        </Card.Title>
                        
                        <Card.Text className="card-text mb-4 flex-grow-1">
                          {post.excerpt}
                        </Card.Text>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="blog-tags mb-3">
                            {post.tags.map((tag) => (
                              <span key={tag} className="badge me-2 mb-1">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-auto">
                          <Link href={`/blog/${post.slug}`} className="btn">
                            Read More →
                          </Link>
                        </div>
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