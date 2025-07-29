'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Container } from 'react-bootstrap'
import { getProjects, ContentfulProject } from '@/lib/api'
import { createImageUrl, getProjectYear } from '@/lib/utils'
import { ProjectsGridSkeleton } from './skeleton'

export const RecentProjects = () => {
  const [projects, setProjects] = useState<ContentfulProject[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const allProjects = await getProjects()
        setProjects(allProjects.slice(0, 3))
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
    <Container>
      <h1 className="display-2 py-5">Recent Projects</h1>
      <div className="card-columns card-columns-3 d-block">
        {projects.map(project => (
          <div className="card d-block" key={project.sys.id}>
            <Link href={`/projects/${project.fields.url}`}>
              <Image
                className="card-img"
                src={createImageUrl(project.fields.featuredImage.fields.file.url)}
                alt={project.fields.title}
                width={1000}
                height={600}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover'
                }}
              />
            </Link>

            <div className="card-body">
              <Link href={`/projects/${project.fields.url}`}>
                <p className="overline">
                  {project.fields.medium} — {getProjectYear(project.fields.date)}
                </p>
                <h5 className="card-title">{project.fields.title}</h5>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <div className="py-5 text-right d-flex justify-content-center justify-content-md-end">
        <button
          className="shape-pill large-button"
          onClick={() => router.push('/projects')}
        >
          Go to Projects
        </button>
      </div>
    </Container>
  )
}