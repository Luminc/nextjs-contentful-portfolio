'use client'

import Layout from '@/components/layout'
import { Container, Row, Col } from 'react-bootstrap'
import Link from 'next/link'

/**
 * CUSTOM 404 NOT FOUND PAGE
 * 
 * This component creates a user-friendly 404 error page that maintains
 * the site's design consistency while providing helpful navigation options.
 * 
 * Features:
 * - Consistent layout with site header/footer
 * - Clear error messaging with visual hierarchy
 * - Multiple navigation options for users
 * - Professional design matching portfolio aesthetic
 */

export default function NotFound() {
  return (
    <Layout pageTitle="Page Not Found">
      <Container>
        <Row className="justify-content-center text-center py-5">
          <Col lg={8}>
            {/* Large 404 display */}
            <div className="display-1 fw-bold text-primary mb-4" style={{ fontSize: '8rem', lineHeight: '1' }}>
              404
            </div>
            
            {/* Main error message */}
            <h1 className="display-4 fw-bold text-dark mb-4">
              Page Not Found
            </h1>
            
            {/* Descriptive message */}
            <p className="lead text-muted mb-5">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. 
              Let&apos;s get you back on track.
            </p>
            
            {/* Navigation options */}
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link href="/" className="btn btn-primary btn-lg">
                ← Back to Home
              </Link>
              <Link href="/projects" className="btn btn-outline-primary btn-lg">
                View Projects
              </Link>
            </div>
            
            {/* Additional help text */}
            <div className="mt-5 pt-4 border-top">
              <p className="text-muted small">
                If you believe this is an error, please{' '}
                <Link href="/#contact" className="text-primary text-decoration-underline">
                  get in touch
                </Link>
                .
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}