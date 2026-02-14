'use client'

import { useRouter } from 'next/navigation'
import { Container } from 'react-bootstrap'
import { ContentfulProject } from '@/types/contentful'
import { ProjectCard } from './project-card'

interface RecentProjectsClientProps {
  projects: ContentfulProject[]
}

export const RecentProjectsClient: React.FC<RecentProjectsClientProps> = ({ projects }) => {
  const router = useRouter()

  // Separate projects by type
  const installationProjects = projects.filter(p => p.fields.type === 'Installation')
  const writingProjects = projects.filter(p => p.fields.type === 'Writing')

  // Get first 3 of each type
  const installations = installationProjects.slice(0, 3)
  const writings = writingProjects.slice(0, 3)

  return (
    <>
      {/* Installation Projects Section */}
      {installations.length > 0 && (
        <div className="container-wide">
          <h1 className="display-2 py-5">Projects</h1>
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
              See all
            </button>
          </div>
        </div>
      )}

      {/* Writing Projects Section */}
      {writings.length > 0 && (
        <div className="container-wide">
          <h1 className="display-2 py-5 mt-5">Writing</h1>
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
              See all
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default RecentProjectsClient
