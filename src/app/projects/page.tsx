'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout'
import { getProjects } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from 'react-bootstrap'
import { createImageUrl, getProjectYear } from '@/lib/utils'
import { ProjectsGridSkeleton } from '@/components/skeleton'
import { ContentfulProject } from '@/types/contentful'
import { useKeyboardNavigation } from '@/hooks/useKeyboardNavigation'

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ContentfulProject[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        const fetchedProjects = await getProjects()
        setProjects(fetchedProjects)
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
      <Layout pageTitle="Projects">
        <ProjectsGridSkeleton />
      </Layout>
    )
  }

  return (
    <Layout pageTitle="Projects">
      <Container>
        <div 
          id="projects-grid" 
          className="card-columns card-columns-3 d-block"
          role="grid"
          aria-label="Projects gallery"
        >
          {projects.map(project => (
            <div className="card d-block" key={project.sys.id}>
              <Link href={`/projects/${project.fields.url}`}>
                <Image
                  className="card-img"
                  src={createImageUrl(project.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg')}
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
      </Container>
    </Layout>
  )
}