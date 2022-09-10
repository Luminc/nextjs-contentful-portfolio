// Step 1: Import React
import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { GatsbyImage } from 'gatsby-plugin-image'
import Carousel from 'react-bootstrap/Carousel';
import Container from 'react-bootstrap/Container'
import { graphql, Link} from 'gatsby'
import 'bootstrap/dist/css/bootstrap.min.css';
import Hero from '../components/hero';

const IndexPage = ({data}) => {
  return (
    <Layout pageTitle="Jeroen Kortekaas">
      <Hero/>
    <Container fluid>
    <Carousel pause={false} indicators={false} className="mb-5">
    {data.allContentfulHeroImages.edges.map(image => (
        <Carousel.Item>
          <Link 
          to={`/projects/departure-arrival-return`}
          >
            <GatsbyImage
              className="d-block w-100"
              image={image.node.image.gatsbyImageData}
              alt=""
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

