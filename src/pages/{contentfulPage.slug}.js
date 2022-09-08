import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { graphql } from 'gatsby';
import {GatsbyImage, getImage} from 'gatsby-plugin-image'
import ContentfulRichTech from '../components/contentful-rich-text';


const Page = ({data}) => {
  const image = getImage(data.contentfulPage.image.gatsbyImageData)
    return (
        <Layout SiteTitle={data.contentfulPage.title}>
                <GatsbyImage
      image={image}
      alt="Placeholder"
      />
          <h1>{data.contentfulPage.title}</h1>
            <p>{data.contentfulPage.description.internal.content}</p>
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