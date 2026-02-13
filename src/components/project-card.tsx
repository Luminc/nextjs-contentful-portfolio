'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ContentfulProject } from '@/types/contentful'
import { createImageUrl, getProjectYear } from '@/lib/utils'

interface ProjectCardProps {
  project: ContentfulProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isWriting = project.fields.type === 'Writing'
  const cardClass = `card project-card ${isWriting ? 'project-writing' : 'project-installation'}`

  return (
    <div className={cardClass}>
      <Link href={`/projects/${project.fields.url}`}>
        {isWriting ? (
          <div className="writing-cover-wrapper">
            <Image
              className="card-img"
              src={createImageUrl(
                project.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg'
              )}
              alt={project.fields.title}
              width={1000}
              height={1200}
              style={{
                width: '100%',
                height: 'auto',
                objectFit: 'contain',
              }}
            />
          </div>
        ) : (
          <Image
            className="card-img"
            src={createImageUrl(
              project.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg'
            )}
            alt={project.fields.title}
            width={1000}
            height={600}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'cover',
            }}
          />
        )}
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
  )
}