'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Layout from '@/components/layout'
import ContentfulRichText from '@/components/contentful-rich-text'
import { getPage } from '@/lib/api'
import { Container, Row, Col } from 'react-bootstrap'
import Image from 'next/image'
import { createImageUrl } from '@/lib/utils'
import { PageSkeleton } from '@/components/skeleton'
import { ContentfulPage } from '@/types/contentful'

export default function DynamicPage() {
  const params = useParams()
  const [page, setPage] = useState<ContentfulPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const fetchedPage = await getPage(params.slug as string)
        setPage(fetchedPage)
      } catch (error) {
        console.error('Error fetching page:', error)
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
    return <Layout><Container><p>Page not found</p></Container></Layout>
  }

  return (
    <Layout pageTitle={page.fields.title}>
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
    </Layout>
  )
}