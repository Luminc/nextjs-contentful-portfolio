import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import {
heading,
navLinks,
navLinkItem,
navLinkText,
logo} from './layout.module.css'
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
        <ul className="d-flex">
          <h1 className="display-4"><Link to ="/">{data.site.siteMetadata.title}</Link></h1> 
        </ul>
        <ul className={navLinks}>
          <li className={navLinkItem}><Link to="/" className={navLinkText}>Home</Link></li>
          <li className={navLinkItem}><Link to="/projects"  className={navLinkText}>Projects</Link></li>
          {data.allContentfulPage.edges.map(item => (
              <li key={item.node.slug} className={navLinkItem}>
                <Link to={`/${item.node.slug}`} className={navLinkText}>{item.node.title}</Link>
              </li>
            ))}
        </ul>
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