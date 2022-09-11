// Step 1: Import React
import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { GatsbyImage } from 'gatsby-plugin-image'
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container'
import { graphql, Link} from 'gatsby'
import 'bootstrap/dist/css/bootstrap.min.css';
import {carouselStyle, cover} from '../components/layout.module.css'

const IndexPage = ({data}) => {
  return (
    <Layout pageTitle="Jeroen Kortekaas">
    <Container fluid>
    <Carousel pause={false} indicators={false} className={carouselStyle}>
    {data.allContentfulHeroImages.edges.map(image => (
        <Carousel.Item>
          <Link 
          to={`/projects/${image.node.slug}`}
          >
            <GatsbyImage
              className={cover}
              image={image.node.image.gatsbyImageData}
              alt={image.node.description}
            />
            </Link>
        </Carousel.Item>
      ))}
    </Carousel>
    <Container>
      <p>I'm building a gatsby website</p>
      <p>Some text</p>
      </Container>
    

    </Container>

    </Layout>
  )
}
export const data = graphql`query{
  allContentfulHeroImages {
    edges {
      node {
        image {
          gatsbyImageData
          description
        }
      }
    }
  }
  contentfulHeroImages {
    image {
      gatsbyImageData
    }
  }
}`

export const Head = () => <Seo title="Home page"/>

export default IndexPage

