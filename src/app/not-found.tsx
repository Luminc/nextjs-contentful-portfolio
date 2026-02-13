'use client'

import Layout from '@/components/layout'
import { Container, Row, Col } from 'react-bootstrap'
import Link from 'next/link'
import HeroFlight from '@/components/hero-flight'

/**
 * CUSTOM 404 NOT FOUND PAGE
 *
 * This component creates a user-friendly 404 error page that maintains
 * the site's design consistency while providing helpful navigation options.
 *
 * Features:
 * - Consistent layout with site header/footer
 * - Scrolling background animation (hero-flight)
 * - Clear error messaging with visual hierarchy
 * - Multiple navigation options for users
 * - Professional design matching portfolio aesthetic
 */

export default function NotFound() {
  return (
    <Layout pageTitle="Page Not Found">
              <Container>
              {/* Descriptive message */}
              <p className="lead text-dark mb-5 lh-lg">
                Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved. Get out of here.
              </p>
</Container>
      <HeroFlight minHeight="80vh"/>
    </Layout>
  )
}