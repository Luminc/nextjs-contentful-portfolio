'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from 'react-bootstrap'
import { getProjects } from '@/lib/api'
import { ContentfulProject } from '@/types/contentful'
import { ProjectsGridSkeleton } from './skeleton'
import { ProjectCard } from './project-card'

export const RecentProjects = () => {
  const [installations, setInstallations] = useState<ContentfulProject[]>([])
  const [writings, setWritings] = useState<ContentfulProject[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const allProjects = await getProjects()

        // Separate projects by type
        const installationProjects = allProjects.filter(p => p.fields.type === 'Installation')
        const writingProjects = allProjects.filter(p => p.fields.type === 'Writing')

        // Get first 3 of each type
        setInstallations(installationProjects.slice(0, 3))
        setWritings(writingProjects.slice(0, 3))
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  if (loading) {
    return (
      <Container>
        <h1 className="display-2 py-5">Recent Projects</h1>
        <ProjectsGridSkeleton />
      </Container>
    )
  }

  return (
    <>
      {/* Installation Projects Section */}
      {installations.length > 0 && (
        <div className="container-wide">
          <h1 className="display-2 py-5">Recent Installations</h1>
          <div className="card-columns-3">
            {installations.map(project => (
              <ProjectCard key={project.sys.id} project={project} />
            ))}
          </div>
          <div className="py-4 text-right d-flex justify-content-center justify-content-md-end">
            <button
              className="shape-pill large-button"
              onClick={() => router.push('/projects?filter=Installation')}
            >
              View All Installations
            </button>
          </div>
        </div>
      )}

      {/* Writing Projects Section */}
      {writings.length > 0 && (
        <div className="container-wide">
          <h1 className="display-2 py-5 mt-5">Recent Writing</h1>
          <div className="card-columns-3">
            {writings.map(project => (
              <ProjectCard key={project.sys.id} project={project} />
            ))}
          </div>
          <div className="py-4 text-right d-flex justify-content-center justify-content-md-end">
            <button
              className="shape-pill large-button"
              onClick={() => router.push('/projects?filter=Writing')}
            >
              View All Writing
            </button>
          </div>
        </div>
      )}
    </>
  )
}