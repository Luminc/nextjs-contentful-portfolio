import React from 'react'
import { graphql, useStaticQuery} from 'gatsby'
import {Container, Col, Row} from 'react-bootstrap'

export const Footer = () => {
    const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          eMail
          author
        }
      }
    }`);
  return (
    <Container fluid style={{marginTop: "3rem"}}>
  <Row>
    <Col className="d-none d-md-block" s={5} md={6} xl={9}> 
    <div className="hero-flight"></div>
    </Col>
    <Col className="footer" style={{minHeight: "300px"}}>
  <a
    href={`mailto:${data.site.siteMetadata.eMail}`}
    target="_top"
    className="py-2"
  >
    {data.site.siteMetadata.eMail}
  </a>
  <div className="copyright">
    &copy; {new Date().getFullYear()} {data.site.siteMetadata.author}, All rights reserved
  </div>
  
  </Col>
  </Row>
  </Container>
  )
}