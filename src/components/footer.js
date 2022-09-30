import React from "react";
import { graphql, useStaticQuery, Link, navigate } from "gatsby";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export const Footer = () => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          eMail
          author
          insta
          siteUrl
          facebook
          github
          phone
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
  `);
  return (
    <footer>
      <Container className="d-sm-block d-md-none">
        <ul className="footer-links">
          <li className="footer-links-brand">
            <Link to="/">{data.site.siteMetadata.author}</Link>
          </li>
          <li className="footer-links-item">
            <Link to="/projects">Projects</Link>
          </li>

          {data.allContentfulPage.edges.map(item => (
            <li className="footer-links-item" key={item.node.slug}>
              <Link to={`/${item.node.slug}`}>About</Link>
            </li>
          ))}
        </ul>
        <ul className="contact-links">
          <li className="contact-links-item">
            {" "}
            <a
              href={`mailto:${data.site.siteMetadata.eMail}`}
              target="_top"
              className=" h2 external"
            >
              {data.site.siteMetadata.eMail}
            </a>
          </li>
          <li className="contact-links-item">
            {" "}
            <a href={`tel:${data.site.siteMetadata.phone}`} target="_top">
              {data.site.siteMetadata.phone}
            </a>
          </li>
        </ul>
        <ul className="social-links">
          <li className="social-links-item">
            {" "}
            <a href={`${data.site.siteMetadata.insta}`} target="_top">
              Instagram
            </a>
          </li>
          <li className="social-links-item">
            {" "}
            <a href={`${data.site.siteMetadata.facebook}`} target="_top">
              Facebook
            </a>
          </li>
          <li className="social-links-item">
            {" "}
            <a href={`${data.site.siteMetadata.github}`} target="_top">
              Github
            </a>
          </li>
        </ul>
        <div className="copyright pb-3">
          &copy; {new Date().getFullYear()} {data.site.siteMetadata.author}
        </div>
      </Container>
      <Container fluid className="d-none d-md-block">
        <Row className="flex-column flex-md-row my-5">
          <Col className="text-center my-5">
            {" "}
            <a
              href={`${data.site.siteMetadata.siteUrl}`}
              target="_top"
              className=" h2"
            >
              {data.site.siteMetadata.author}
            </a>
          </Col>
          <Col className="text-center my-5">
            <a
              href={`mailto:${data.site.siteMetadata.eMail}`}
              target="_top"
              className=" h2"
            >
              {data.site.siteMetadata.eMail}
            </a>
          </Col>
          <Col className="text-center my-5">
            {" "}
            <a
              href={`${data.site.siteMetadata.insta}`}
              target="_top"
              className="py-2 h2"
            >
              Instagram
            </a>
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            <div className="mb-1">
              <div className="nav-bottom">
                <div className="py-4">
                  <div className="d-inline">
                    <Link to="/projects">PROJECTS</Link>
                  </div>
                  {" | "}
                  {data.allContentfulPage.edges.map(item => (
                    <div key={item.node.slug} className="d-inline">
                      <Link to={`/${item.node.slug}`}>
                        {item.node.title.toUpperCase()}
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="copyright pb-3">
              &copy; {new Date().getFullYear()} {data.site.siteMetadata.author}
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};
