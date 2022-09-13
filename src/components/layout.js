import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import {
heading,
navLinks,
navLinkItem,
navLinkText,
linkStyling,
logo} from './layout.module.css'
import Seo from '../components/seo'
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
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
          <Link to ="/" className={linkStyling}>{data.site.siteMetadata.title}</Link>
      <div className={navLinks}>
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
      <Container fluid style={{marginTop: "3rem"}}>
      <Row>
        <Col className="d-none d-md-block" s={5} md={6} xl={9}> 
        <div className="hero-flight"></div>
        </Col>
        <Col className="footer" style={{mingHeight: "300px"}}>
      <a
        href="mailto:studio@jeroenkortekaas.com"
        target="_top"
        className="py-2"
        style={{fontSize: "1.25rem"}}
      >
        studio@jeroenkortekaas.com
      </a>
      <div className="mt-2 social">
        <a
          href="https://www.facebook.com/jeroen.kortekaas.77"
          target="_blank"
          rel="noopener noreferrer"
          className="light text-decoration-none pr-1"
        >
        </a>
        <a
          href="https://www.instagram.com/bluecarabiner/"
          target="_blank"
          rel="noopener noreferrer"
          className="light text-decoration-none p-1"
        >
        </a>
        <a
          href="mailto:studio@jeroenkortekaas.com"
          target="_blank"
          rel="noopener noreferrer"
          className="light text-decoration-none p-1"
        >
        </a>
      </div>
      <div className="copyright">
        &copy; {new Date().getFullYear()} Jeroen Kortekaas, All rights reserved
      </div>
      
      </Col>
      </Row>
    </Container>
    </div>
  )
}



export default Layout