import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { graphql } from 'gatsby';


const Page = ({data}) => {
    return (
        <Layout pageTitle={data.contentfulPage.title}>
            <p>Test</p>
        </Layout>
    )
}

export const data = graphql`
query {
    contentfulPage {
      title
      description

    }
  }`
;

export const Head = ({data}) => <Seo title={data.contentfulPage.title} />
export default Page