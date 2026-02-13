'use client'

import Layout from '@/components/layout'
import { Container } from 'react-bootstrap'
import HeroFlight from '@/components/hero-flight'

export default function ThanksPage() {
  return (
    <Layout pageTitle="Thank You">
      <Container>
            <p className="lead">
              Thank you for subscribing! You will receive updates about new projects and exhibitions.
            </p>
      </Container>
      <HeroFlight minHeight="70vh"/>
    </Layout>
  )
}