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
            <div className="display-1 mb-4" style={{ fontSize: '8rem', lineHeight: '1' }}>
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
              <Link href="/" className="shape-pill large-button hot">
                ← Back to Home
              </Link>
              <Link href="/projects" className="shape-pill large-button hot">
                View Projects
              </Link>
            </div>
          
          </Col>
        </Row>
      </Container>
    </Layout>
  )
}