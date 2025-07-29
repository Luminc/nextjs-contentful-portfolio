'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import Video from '@/components/video'
import { getProject, getProjects } from '@/lib/api'
import Image from 'next/image'
import Link from 'next/link'
import { Container, Row, Col, Carousel } from 'react-bootstrap'
import { createImageUrl, formatDate } from '@/lib/utils'
import { ContentfulProject } from '@/types/contentful'

export default function ProjectPage() {
  const params = useParams()
  const [project, setProject] = useState<ContentfulProject | null>(null)
  const [prev, setPrev] = useState<ContentfulProject | null>(null)
  const [next, setNext] = useState<ContentfulProject | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        const [fetchedProject, allProjects] = await Promise.all([
          getProject(params.slug as string),
          getProjects()
        ])
        
        if (!fetchedProject) {
          setLoading(false)
          return
        }

        setProject(fetchedProject)
        
        const currentIndex = allProjects.findIndex(p => p.fields.url === params.slug)
        setPrev(currentIndex > 0 ? allProjects[currentIndex - 1] : null)
        setNext(currentIndex < allProjects.length - 1 ? allProjects[currentIndex + 1] : null)
      } catch (error) {
        console.error('Error fetching project:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProjectData()
    }
  }, [params.slug])

  if (loading) {
    return <Layout><Container><p>Loading...</p></Container></Layout>
  }

  if (!project) {
    return <Layout><Container><p>Project not found</p></Container></Layout>
  }

  const formattedDate = formatDate(project.fields.date)
  const projectYear = new Date(project.fields.date).getFullYear()

  return (
    <Layout className="project-page">
      <Container fluid="xxl">
        <p className="text-center project-subtitle pt-5">{projectYear}</p>
        <h1 className="text-center display-1 py-2">
          {project.fields.title}
        </h1>
        <p className="text-center project-subtitle pb-5">
          {project.fields.medium}
        </p>
      </Container>
      
      <Row id="project-content" className="mb-5">
        <Col md className="pb-5 featured-project-image">
          <Image
            src={createImageUrl(project.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg')}
            alt={project.fields.featuredImage?.fields?.description || project.fields.title}
            width={project.fields.featuredImage?.fields?.file?.details?.image?.width || 1200}
            height={project.fields.featuredImage?.fields?.file?.details?.image?.height || 800}
            className="featured-project-image contain"
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain'
            }}
          />
        </Col>

        {project.fields.content && (
          <Col>
            <Container>
              <ContentfulRichText richText={project.fields.content} />
              {project.fields.materials && (
                <div>
                  <p className="leading-loose caption caption-title">
                    Materials:
                  </p>
                  <p className="leading-loose caption">
                    {project.fields.materials}
                  </p>
                </div>
              )}
              <p className="leading-loose caption caption-title">Date:</p>
              <p className="leading-loose caption">{formattedDate}</p>
            </Container>
          </Col>
        )}
      </Row>

      {/* Sections */}
      {project.fields.sections?.map((section: any) =>
        section.sys?.id ? (
          <section key={section.sys.id}>
            {section.sys.contentType?.sys.id === 'sectionImageWide' && (
              <Image
                src={createImageUrl(section.fields.image.fields.file.url)}
                alt={section.fields.alt || section.fields.title}
                width={section.fields.image.fields.file.details.image.width}
                height={section.fields.image.fields.file.details.image.height}
                loading="lazy"
                style={{ width: '100%', height: 'auto' }}
              />
            )}
            
            {section.sys.contentType?.sys.id === 'documentation' &&
              section.fields.images?.map((image: any) => (
                <Container fluid="xxl" key={image.sys.id}>
                  <div className="image-wrapper">
                    <Image
                      src={createImageUrl(image.fields.file.url)}
                      alt={image.fields.fileName}
                      width={image.fields.file.details.image.width}
                      height={image.fields.file.details.image.height}
                      loading="lazy"
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </div>
                </Container>
              ))}
              
            {section.sys.contentType?.sys.id === 'containerVideo' && (
              <Container fluid="sm" className="my-5">
                <Video Src={createImageUrl(section.fields.video.fields.file.url)} muted={true} />
              </Container>
            )}
            
            {section.sys.contentType?.sys.id === 'carousel' && (
              <Container fluid="sm">
                <Carousel
                  fade
                  interval={section.fields.interval}
                  pause={section.fields.pause}
                  controls={section.fields.controls}
                  indicators={section.fields.indicators}
                >
                  {section.fields.images?.map((image: any, index: number) => (
                    <Carousel.Item key={image.fields.fileName}>
                      <Image
                        src={createImageUrl(image.fields.file.url)}
                        alt={section.fields.title}
                        width={image.fields.file.details.image.width}
                        height={image.fields.file.details.image.height}
                        loading={index === 0 ? "eager" : "lazy"}
                        style={{ width: '100%', height: 'auto' }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Container>
            )}
          </section>
        ) : null
      )}

      {/* Main video */}
      {project.fields.video && (
        <Container fluid className="my-5">
          <Video
            Src={createImageUrl(project.fields.video.fields.file.url)}
            Title={project.fields.video.fields.title}
          />
        </Container>
      )}

      {/* Documentation images */}
      <Container>
        {project.fields.documentation?.map((image: any) => (
          <div className="image-wrapper" key={image.sys.id}>
            <Image
              alt={image.sys.id}
              src={createImageUrl(image.fields.file.url)}
              width={image.fields.file.details.image.width}
              height={image.fields.file.details.image.height}
              loading="lazy"
              style={{ width: '100%', height: 'auto' }}
            />
          </div>
        ))}
        
        {/* Navigation */}
        <div className="card-group align-items-end justify-content-between py-5 mt-4">
          {prev ? (
            <>
              <div className="card pagination-card d-none d-md-block">
                <Link href={`/projects/${prev.fields.url}`}>
                  <Image
                    className="card-img"
                    src={createImageUrl(prev.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg')}
                    alt={prev.fields.title}
                    width={600}
                    height={600}
                    loading="lazy"
                    style={{ objectFit: 'contain' }}
                  />
                </Link>
                <div className="card-body">
                  <Link href={`/projects/${prev.fields.url}`}>
                    <h5 className="card-title">&lt; {prev.fields.title}</h5>
                  </Link>
                </div>
              </div>
              <div className="d-md-none">
                <Link href={`/projects/${prev.fields.url}`}>&lt; Previous project</Link>
              </div>
            </>
          ) : (
            <div>
              <p className="card-title h2 grayed p2">&lt;</p>
            </div>
          )}
          
          {next ? (
            <>
              <div className="card pagination-card d-none d-md-block">
                <Link href={`/projects/${next.fields.url}`}>
                  <Image
                    className="card-img"
                    src={createImageUrl(next.fields.featuredImage?.fields?.file?.url || '/placeholder.jpg')}
                    alt={next.fields.title}
                    width={600}
                    height={600}
                    loading="lazy"
                    style={{ objectFit: 'contain' }}
                  />
                </Link>
                <div className="card-body">
                  <Link href={`/projects/${next.fields.url}`}>
                    <h5 className="card-title text-right">{next.fields.title} &gt;</h5>
                  </Link>
                </div>
              </div>
              <div className="d-md-none">
                <Link href={`/projects/${next.fields.url}`}>Next project &gt;</Link>
              </div>
            </>
          ) : (
            <div>
              <p className="card-title h2 grayed p-3">&gt;</p>
            </div>
          )}
        </div>
      </Container>
    </Layout>
  )
}