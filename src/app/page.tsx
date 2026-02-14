/**
 * HOME PAGE - SERVER COMPONENT
 *
 * Server-rendered homepage with carousel and recent projects
 */

import Layout from '@/components/layout'
import CarouselLanding from '@/components/carousel-landing-client'
import RecentProjectsClient from '@/components/recentprojects-client'
import { EmailForm } from '@/components/emailform'
import { getHeroImages, getProjects } from '@/lib/contentful'

export default async function HomePage() {
  // Fetch data server-side
  const [heroImages, projects] = await Promise.all([
    getHeroImages(),
    getProjects(),
  ])

  return (
    <Layout>
      <CarouselLanding heroImages={heroImages} />
      <RecentProjectsClient projects={projects} />
      <EmailForm />
    </Layout>
  )
}
