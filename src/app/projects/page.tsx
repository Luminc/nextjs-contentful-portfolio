/**
 * PROJECTS LISTING PAGE - SERVER COMPONENT WITH CLIENT INTERACTIVITY
 *
 * Server-rendered projects listing with client-side filtering
 */

import { Suspense } from 'react'
import Layout from '@/components/layout'
import { getProjects } from '@/lib/contentful'
import ProjectsContent from './projects-content-client'
import { ProjectsGridSkeleton } from '@/components/skeleton'

export default async function ProjectsPage() {
  // Fetch projects server-side
  const projects = await getProjects()

  return (
    <Layout>
      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsContent projects={projects} />
      </Suspense>
    </Layout>
  )
}
