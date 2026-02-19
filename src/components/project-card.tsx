'use client'

import Image from 'next/image'
import Link from 'next/link'
import { SanityProject } from '@/types/sanity'
import { getProjectYear } from '@/lib/utils'

interface ProjectCardProps {
  project: SanityProject
}

export function ProjectCard({ project }: ProjectCardProps) {
  const isWriting = project.type === 'Writing'
  const cardClass = `card project-card ${isWriting ? 'project-writing' : 'project-installation'}`
  const imageUrl = project.featuredImage?.asset?.url || '/placeholder.jpg'
  const width = project.featuredImage?.asset?.metadata?.dimensions?.width || 1000
  const height = project.featuredImage?.asset?.metadata?.dimensions?.height || (isWriting ? 1200 : 600)

  return (
    <div className={cardClass}>
      <Link href={`/projects/${project.url}`}>
        {isWriting ? (
          <div className="writing-cover-wrapper">
            <Image
              className="card-img"
              src={imageUrl}
              alt={project.title}
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
          </div>
        ) : (
          <Image
            className="card-img"
            src={imageUrl}
            alt={project.title}
            width={width}
            height={height}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
          />
        )}
      </Link>

      <div className="card-body">
        <Link href={`/projects/${project.url}`}>
          <p className="overline">
            {project.medium} — {getProjectYear(project.date || '')}
          </p>
          <h5 className="card-title">{project.title}</h5>
        </Link>
      </div>
    </div>
  )
}
