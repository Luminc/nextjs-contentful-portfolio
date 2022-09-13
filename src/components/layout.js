import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import {
heading,
navLinks,
navLinkItem,
navLinkText,
linkStyling} from './layout.module.css'
import Seo from '../components/seo'
import Container from 'react-bootstrap/Container'
import './app.css'

const Layout = ({ pageTitle, children }) => {

    const data = useStaticQuery(graphql`query {
      
      site {
        siteMetadata {
          description
          siteUrl
          title
        }
      }
      allContentfulPage {
        edges {
          node {
            slug
            title
          }
        }
      }
      }
      `)
  return (
    <div>
      <Seo/>
      <Container fluid>
      <nav>
        <div className="d-flex justify-content-between align-items-end nav-links">
          <h1 className="logo"><Link to ="/" className={linkStyling}>{data.site.siteMetadata.title}</Link></h1> 
      <div className={navLinks}>
          <div className={navLinkItem}><Link to="/" className={navLinkText}>Home</Link></div>
          <div className={navLinkItem}><Link to="/projects"  className={navLinkText}>Projects</Link></div>
          {data.allContentfulPage.edges.map(item => (
              <div key={item.node.slug} className={navLinkItem}>
                <Link to={`/${item.node.slug}`} className={navLinkText}>{item.node.title}</Link>
              </div>
              
            ))}
          </div>
        </div>
      </nav>
      <main>
        
        <h1 className={heading}>{pageTitle}</h1>
        {children}
        
      </main>
      </Container>  
    </div>
  )
}



export default Layout