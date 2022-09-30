import React from "react";
import { useStaticQuery, graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Container } from "react-bootstrap";

const Instagram = () => {
  const data = useStaticQuery(graphql`
    {
      allInstagramContent(limit: 8) {
        edges {
          node {
            caption
            localImage {
              childImageSharp {
                gatsbyImageData(width: 200)
              }
            }
            permalink
            id
          }
        }
      }
      site {
        siteMetadata {
          insta
          instaHandle
        }
      }
    }
  `);
  return (
    <Container>
      <p className="leading-loose text-center">
        Instagram{" "}
        <a className="ml-2" href={data.site.siteMetadata.insta}>
          {data.site.siteMetadata.instaHandle}
        </a>
      </p>
      <Row xs={2} sm={4} md={8}>
        {data.allInstagramContent.edges.map(post => (
          <Col className="mb-4">
            <div className="card">
              <a
                href={post.node.permalink}
                aria-label={
                  post.node.caption
                    ? post.node.caption
                    : "See more instagram posts from Jeroen Kortekaas"
                }
              >
                <GatsbyImage
                  className="card-img"
                  image={post.node.localImage.childImageSharp.gatsbyImageData}
                  alt={
                    post.node.caption
                      ? post.node.caption
                      : "Instagram post from Jeroen Kortekaas"
                  }
                />
              </a>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Instagram;
