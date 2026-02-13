'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Layout from '@/components/layout'
import { getProjects } from '@/lib/api'
import { ProjectsGridSkeleton } from '@/components/skeleton'
import { ContentfulProject } from '@/types/contentful'
import { ProjectCard } from '@/components/project-card'

export default function ProjectsPage() {
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
    return (
      <Layout pageTitle="Projects">
        <ProjectsGridSkeleton />
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Projects">
      <div className="container-wide">
        {/* Mobile: Tabs */}
        <div className="project-tabs d-md-none mb-4">
          <div className="d-flex justify-content-center gap-3">
            <button
              className={`shape-pill ${activeTab === 'Installation' ? 'active' : ''}`}
              onClick={() => setActiveTab('Installation')}
            >
              Installations ({installations.length})
            </button>
            <button
              className={`shape-pill ${activeTab === 'Writing' ? 'active' : ''}`}
              onClick={() => setActiveTab('Writing')}
            >
              Writing ({writings.length})
            </button>
          </div>
        </div>

        {/* Mobile: Show active tab content */}
        <div className="d-md-none">
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

        {/* Desktop: Side by side columns */}
        <div className="d-none d-md-grid project-columns">
          <div className="project-column">
            <h2 className="h3 mb-4">Installations</h2>
            <div className="card-columns-2">
              {installations.map(project => (
                <ProjectCard key={project.sys.id} project={project} />
              ))}
            </div>
          </div>
          <div className="project-column">
            <h2 className="h3 mb-4">Writing</h2>
            <div className="card-columns-1">
              {writings.map(project => (
                <ProjectCard key={project.sys.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}