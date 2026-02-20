'use client'

import Layout from '@/components/layout'
import { Container } from 'react-bootstrap'
import HeroFlight from '@/components/hero-flight'

export default function ThanksPage() {
  return (
    <Layout pageTitle="Thank You">
      <div className="container-wide">
        <p className="lead">
          Thank you — one more step. Please check your inbox and confirm your email address to complete your subscription.
        </p>
      </div>
      <HeroFlight minHeight="70vh" />
    </Layout>
  )
}