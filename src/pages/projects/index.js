import * as React from 'react'
import { graphql, Link} from 'gatsby'
import Layout from '../../components/layout'
import {GatsbyImage} from 'gatsby-plugin-image'
import Seo from '../../components/seo'
import Container from 'react-bootstrap/Container'

const ProjectPage = ({data}) => {
  return (
    <Layout pageTitle="Projects">
      <Container>
        {
            data.allContentfulProject.nodes.map(node => (
            <article key={node.id}>
              <GatsbyImage image={node.featuredImage.gatsbyImageData} alt=""/>
                <h2><Link to={`/projects/${node.url}`}>{node.title}</Link></h2>
                <p>{node.year}</p>
                <p>{node.medium}</p>
            </article>)
            )}
      </Container>
    </Layout>
  )
}

export const query = graphql`
query MyQuery {
    allContentfulProject(sort: {fields: year, order: DESC}) {
      nodes {
        title
        url
        year
        medium
        id
        featuredImage{
          gatsbyImageData(width:1000)
        }
      }
    }
  }
  
`
  

export const Head = () => <Seo title="My Blog Posts" />
export default ProjectPage