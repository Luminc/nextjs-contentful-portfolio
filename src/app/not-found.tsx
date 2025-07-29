'use client'

import Layout from '@/components/layout'
import { Container } from 'react-bootstrap'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout pageTitle="Page Not Found">
      <Container>
        <p>Sorry, the page you are looking for could not be found.</p>
        <Link href="/" className="btn btn-primary">
          Return Home
        </Link>
      </Container>
    </Layout>
  )
}