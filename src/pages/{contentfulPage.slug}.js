import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { graphql } from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image'
import ContentfulRichTech from '../components/contentful-rich-text';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'

const Page = ({data}) => {
  const image = getImage(data.contentfulPage.image.gatsbyImageData)
    return (
        <Layout SiteTitle={data.contentfulPage.title}>
               
      <Container fluid>
        <Row>
        <Col md> <GatsbyImage
      image={image}
      alt="Placeholder"
      /></Col>
        <Col>
          <h1>{data.contentfulPage.title}</h1>
            <p className="leading-loose">{data.contentfulPage.description.internal.content}</p>
            </Col>
            </Row>
            </Container>

        </Layout>
    )
}

export const data = graphql`
query  ($id: String) {
    contentfulPage(id: { eq: $id }) {
      title
      image {
        gatsbyImageData
      }
      description {
        
        internal {
          content
        }
      }
    }
  }`
;


export default Page