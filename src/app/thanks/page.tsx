'use client'

import Layout from '@/components/layout'
import { Container } from 'react-bootstrap'
import HeroFlight from '@/components/hero-flight'

export default function ThanksPage() {
  return (
    <Layout pageTitle="Thank You">
      <Container>
            <p className="lead">
              Thank you — one more step. Please check your inbox and confirm your email address to complete your subscription.
            </p>
      </Container>
      <HeroFlight minHeight="70vh"/>
    </Layout>
  )
}