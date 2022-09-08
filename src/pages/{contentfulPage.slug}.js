import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { graphql } from 'gatsby';
import ContentfulRichTech from '../components/contentful-rich-text';


const Page = ({data}) => {
    return (
        <div>
          <h1>{data.contentfulPage.title}</h1>
            <p>Test</p>
        </div>
    )
}

export const data = graphql`
query  ($id: String) {
    contentfulPage(id: { eq: $id }) {
      title
    }
  }`
;


export default Page