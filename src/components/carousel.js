import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import { useStaticQuery, graphql } from "gatsby";
import { cover } from "../components/layout.module.css";
const CarouselLanding = () => {
  const data = useStaticQuery(graphql`
    query {
      allContentfulHeroImages {
        edges {
          node {
            id
            image {
              gatsbyImageData
            }
            slug
            title
            description
          }
        }
      }
    }
  `);
  return (
    <Carousel
      pause={false}
      indicators={false}
      controls={false}
      className="mb-5 m-auto"
      fade
      style={{ width: "97vw", maxWidth: "1500px" }}
    >
      {data.allContentfulHeroImages.edges.map(image => (
        <Carousel.Item key={image.node.id}>
          <Link to={`/projects/${image.node.slug}`}>
            <GatsbyImage
              className={cover}
              image={image.node.image.gatsbyImageData}
              alt={image.node.description ? image.node.description : ""}
            />
          </Link>
          <Link to={`/projects/${image.node.slug}`}>
            <Carousel.Caption>
              <h2 style={{ padding: "10px" }}>
                {image.node.title ? image.node.title : "Placeholder"}{" "}
              </h2>
              <p className="leading-loose">{image.node.description}</p>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselLanding;
