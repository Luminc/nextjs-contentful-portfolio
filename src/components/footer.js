import React from "react";
import { graphql, useStaticQuery, Link } from "gatsby";
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
    <Container fluid>
      <Row className="flex-column flex-md-row my-5">
        <Col className="text-center my-5">
          {" "}
          <a
            href={`${data.site.siteMetadata.siteUrl}`}
            target="_top"
            className=" h2"
          >
            Jeroen Kortekaas
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
  );
};
