// Step 1: Import React
import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { StaticImage } from 'gatsby-plugin-image'

// Step 2: Define your component
const IndexPage = () => {
  return (
    <Layout pageTitle="Jeroen Kortekaas">
      <p>I'm building a gatsby website</p>
      <StaticImage 
      alt="Victory Tent by Jeroen Kortekaas" 
      src="https://www.jeroenkortekaas.com/static/03a078bf2ea9b9adf7312033ffb8d9e7/ea7dd/IMG_331507201Jero.jpg"/>
    </Layout>
  )
}
export const Head = () => <Seo title="Home page"/>
// Step 3: Export your component
export default IndexPage