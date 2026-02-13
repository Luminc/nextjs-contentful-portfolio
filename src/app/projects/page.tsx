'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/layout'
import { getProjects } from '@/lib/api'
import { ProjectsGridSkeleton } from '@/components/skeleton'
import { ContentfulProject } from '@/types/contentful'
import { ProjectCard } from '@/components/project-card'

function ProjectsContent() {
  const [installations, setInstallations] = useState<ContentfulProject[]>([])
  const [writings, setWritings] = useState<ContentfulProject[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'Installation' | 'Writing'>('Installation')
  const searchParams = useSearchParams()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const fetchedProjects = await getProjects()

        // Separate by type
        setInstallations(fetchedProjects.filter(p => p.fields.type === 'Installation'))
        setWritings(fetchedProjects.filter(p => p.fields.type === 'Writing'))

        // Set active tab from URL param if present
        const filterParam = searchParams.get('filter')
        if (filterParam === 'Writing' || filterParam === 'Installation') {
          setActiveTab(filterParam)
        }
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [searchParams])

  if (loading) {
    return <ProjectsGridSkeleton />
  }

  return (
    <div className="container-wide">
      {/* Mobile: Heading toggles */}
      <div className="d-md-none mb-4">
        <div className="d-flex justify-content-center gap-4 mb-4">
          <h1
            className={`display-1 mb-0 py-5 ${activeTab === 'Installation' ? '' : 'text-muted'}`}
            onClick={() => setActiveTab('Installation')}
            style={{ cursor: 'pointer' }}
          >
            Projects
          </h1>
          <h1 className='display-1'>/</h1>
          <h1
            className={`display-1 mb-0 py-5 ${activeTab === 'Writing' ? '' : 'text-muted'}`}
            onClick={() => setActiveTab('Writing')}
            style={{ cursor: 'pointer' }}
          >
            Writing
          </h1>
        </div>

        {/* Mobile: Show active tab content */}
        {activeTab === 'Installation' && (
          <div className="card-columns-2">
            {installations.map(project => (
              <ProjectCard key={project.sys.id} project={project} />
            ))}
          </div>
        )}
        {activeTab === 'Writing' && (
          <div className="card-columns-2">
            {writings.map(project => (
              <ProjectCard key={project.sys.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: Vertical sections */}
      <div className="d-none d-md-block">
        <div className="mb-5">
          <h1 className="display-1 mt-4 py-5">Projects</h1>
          <div className="card-columns-2">
            {installations.map(project => (
              <ProjectCard key={project.sys.id} project={project} />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h1 className="display-1 mt-4 py-5">Writing</h1>
          <div className="card-columns-2">
            {writings.map(project => (
              <ProjectCard key={project.sys.id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  return (
    <Layout>
      <Suspense fallback={<ProjectsGridSkeleton />}>
        <ProjectsContent />
      </Suspense>
    </Layout>
  )
}