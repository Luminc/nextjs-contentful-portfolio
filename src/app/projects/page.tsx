'use client'

import { useState, useEffect } from 'react'
import Layout from '@/components/layout'
import { getProjects } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { Container } from 'react-bootstrap'

const createImageUrl = (url: string) => {
  return url.startsWith('//') ? `https:${url}` : url
}

const getProjectYear = (dateString: string) => {
  return new Date(dateString).getFullYear()
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const fetchedProjects = await getProjects()
        setProjects(fetchedProjects)
      } catch (error) {
        console.error('Error fetching projects:', error)
      }
    }

    fetchProjects()
  }, [])

  return (
    <Layout pageTitle="Projects">
      <Container>
        <div className="card-columns card-columns-3 d-block">
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