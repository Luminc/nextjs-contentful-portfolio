'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { SanityProject } from '@/types/sanity'
import { ProjectCard } from '@/components/project-card'

interface ProjectsContentProps {
  projects: SanityProject[]
}

export default function ProjectsContent({ projects }: ProjectsContentProps) {
  const [activeTab, setActiveTab] = useState<'Installation' | 'Writing'>('Installation')
  const searchParams = useSearchParams()

  const installations = projects.filter(p => p.type === 'Installation')
  const writings = projects.filter(p => p.type === 'Writing')

  useEffect(() => {
    const filterParam = searchParams.get('filter')
    if (filterParam === 'Writing' || filterParam === 'Installation') {
      setActiveTab(filterParam)
    }
  }, [searchParams])

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
          <h1 className='display-1 mb-0 py-5'>/</h1>
          <h1
            className={`display-1 mb-0 py-5 ${activeTab === 'Writing' ? '' : 'text-muted'}`}
            onClick={() => setActiveTab('Writing')}
            style={{ cursor: 'pointer' }}
          >
            Writing
          </h1>
        </div>

        {activeTab === 'Installation' && (
          <div className="card-columns-2">
            {installations.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
        {activeTab === 'Writing' && (
          <div className="card-columns-2">
            {writings.map(project => (
              <ProjectCard key={project._id} project={project} />
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
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h1 className="display-1 mt-4 py-5">Writing</h1>
          <div className="card-columns-2">
            {writings.map(project => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
