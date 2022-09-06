import * as React from 'react'
import { graphql, Link} from 'gatsby'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
const BlogPage = ({data}) => {
  return (
    <Layout pageTitle="My Blog Posts">
      <ul>
        {
            data.allMdx.nodes.map(node => (
            <article key={node.id}>
                <h2><Link to={`/blog/${node.frontmatter.slug}`}>{node.frontmatter.title}</Link></h2>
                <p>{node.frontmatter.date}</p>
                <p>{node.excerpt}</p>
            </article>)
            )}
      </ul>
    </Layout>
  )
}

export const query = graphql`
query {
  allMdx(sort: {fields: frontmatter___date, order: DESC}) {
    nodes {
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        slug
      }
      id
      excerpt
    }
  }
}
`
  

export const Head = () => <Seo title="My Blog Posts" />
export default BlogPage