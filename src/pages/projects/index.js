import * as React from 'react'
import { graphql, Link} from 'gatsby'
import Layout from '../../components/layout'

import Seo from '../../components/seo'

const ProjectPage = ({data}) => {
  return (
    <Layout pageTitle="Projects">
      <ul>
        {
            data.allContentfulProject.nodes.map(node => (
            <article key={node.id}>
                <h2><Link to={`/projects/${node.url}`}>{node.title}</Link></h2>
                <p>{node.year}</p>
                <p>{node.medium}</p>
            </article>)
            )}
      </ul>
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
      }
    }
  }
  
`
  

export const Head = () => <Seo title="My Blog Posts" />
export default ProjectPage