'use client'

import Layout from '@/components/layout'
import CarouselLanding from '@/components/carousel'
import { RecentProjects } from '@/components/recentprojects'
import { EmailForm } from '@/components/emailform'

export default function HomePage() {
  return (
    <Layout>
      <CarouselLanding />
      <RecentProjects />
      <EmailForm />
    </Layout>
  )
}