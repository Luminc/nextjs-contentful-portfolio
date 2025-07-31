'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Layout from '@/components/layout'
import { BlogPost } from '@/lib/blog'
import { format } from 'date-fns'

/**
 * TOPIC FILTERING PAGE
 * 
 * This page displays all posts filtered by a specific topic.
 * Features:
 * - Client-side rendering with loading states
 * - Topic-based filtering
 * - Responsive card layout matching main writing page
 * - Back navigation to all writing
 */

export default function TopicPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [topicName, setTopicName] = useState('')

  useEffect(() => {
    if (!slug) return

    // Convert slug back to topic name (reverse the transformation)
    const topic = slug.replace(/-/g, ' ')
    setTopicName(topic)

    fetch(`/api/writing/topic/${slug}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load topic posts')
        }
        return res.json()
      })
      .then(data => {
        setPosts(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <Layout pageTitle={`Topic: ${topicName}`}>
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
      <Layout pageTitle={`Topic: ${topicName}`}>
        <Container>
          <div className="alert alert-danger" role="alert">
            Error loading posts: {error}
          </div>
          <Link href="/writing" className="btn btn-primary">
            ← Back to Writing
          </Link>
        </Container>
      </Layout>
    )
  }

  return (
    <Layout pageTitle={`Topic: ${topicName}`}>
      <div className="blog-page">
        <Container>
          <Row className="justify-content-center mb-4">
            <Col lg={8}>
              <Link href="/writing" className="text-decoration-none" style={{ color: 'rgba(20, 20, 20, 0.5)' }}>
                ← Back to All Writing
              </Link>
            </Col>
          </Row>

          {posts.length === 0 ? (
            <Row className="justify-content-center text-center py-5">
              <Col lg={8}>
                <p className="lead text-muted mb-4">
                  No posts found for this topic yet.
                </p>
                <Link href="/writing" className="btn btn-primary">
                  ← Back to Writing
                </Link>
              </Col>
            </Row>
          ) : (
            <div className="blog-index">
              <Row className="justify-content-center mb-5">
                <Col lg={8} className="text-center">
                  <p className="lead" style={{ fontSize: '1.2rem', color: 'rgba(20, 20, 20, 0.7)' }}>
                    {posts.length} {posts.length === 1 ? 'piece' : 'pieces'} exploring {topicName}
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
                          <Link href={`/writing/${post.slug}`}>
                            {post.title}
                          </Link>
                        </Card.Title>
                        
                        <Card.Text className="card-text mb-4 flex-grow-1">
                          {post.excerpt}
                        </Card.Text>
                        
                        <div className="mt-auto">
                          <Link href={`/writing/${post.slug}`} className="btn">
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