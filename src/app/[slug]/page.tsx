'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import { getPage } from '@/lib/api'
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'next/image'
import { createImageUrl } from '@/lib/utils'
import { PageSkeleton } from '@/components/skeleton'
import { ContentfulPage } from '@/types/contentful'
import HeroFlight from '@/components/hero-flight'

export default function DynamicPage() {
  const params = useParams()
  const [page, setPage] = useState<ContentfulPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchedPage = await getPage(params.slug as string)
        if (!fetchedPage) {
          notFound()
        }
        setPage(fetchedPage)
      } catch (error) {
        console.error('Error fetching page:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPage()
    }
  }, [params.slug])

  if (loading) {
    return (
      <Layout>
        <PageSkeleton />
      </Layout>
    )
  }

  if (!page) {
    notFound()
    return null
  }

  const isAboutPage = params.slug === 'about'

  // About page with scrolling background as passepartout frame around photo
  if (isAboutPage && page.fields.image) {
    return (
      <Layout pageTitle={page.fields.title}>
        <div className="container-wide">
          <Row className="mb-5">
            <Col md className="pb-5">
              <HeroFlight className="d-inline-block" minHeight="auto">
                <div style={{ padding: '7rem' }}>
                  <Image
                    src={createImageUrl(page.fields.image.fields.file.url)}
                    alt={page.fields.image.fields.description || page.fields.title}
                    width={page.fields.image.fields.file.details?.image?.width || 800}
                    height={page.fields.image.fields.file.details?.image?.height || 600}
                    style={{
                      width: '100%',
                      height: 'auto',
                      objectFit: 'contain',
                      display: 'block'
                    }}
                  />
                </div>
              </HeroFlight>
            </Col>

            {page.fields.richDescription && (
              <Col>
                <Container>
                  <ContentfulRichText richText={page.fields.richDescription} />
                </Container>
              </Col>
            )}
          </Row>
        </div>
      </Layout>
    )
  }

  // Standard page layout for other pages
  return (
    <Layout pageTitle={page.fields.title}>
      <div className="container-wide">
        <Row className="mb-5">
          {page.fields.image && (
            <Col md className="pb-5">
              <Image
                src={createImageUrl(page.fields.image.fields.file.url)}
                alt={page.fields.image.fields.description || page.fields.title}
                width={page.fields.image.fields.file.details?.image?.width || 800}
                height={page.fields.image.fields.file.details?.image?.height || 600}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'contain'
                }}
              />
            </Col>
          )}

          {page.fields.richDescription && (
            <Col>
              <Container>
                <ContentfulRichText richText={page.fields.richDescription} />
              </Container>
            </Col>
          )}
        </Row>
      </div>
    </Layout>
  )
}