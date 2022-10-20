import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { GatsbyImage } from "gatsby-plugin-image";
import { Link } from "gatsby";
import { useStaticQuery, graphql } from "gatsby";
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
              className="carousel-cover"
              image={image.node.image.gatsbyImageData}
              alt={image.node.description ? image.node.description : ""}
              loading="eager"
            />
          </Link>
          <Link to={`/projects/${image.node.slug}`}>
            <Carousel.Caption style={{ paddingTop: "20px", paddingRight: "0" }}>
              <h5>{image.node.title ? image.node.title : "Placeholder"} </h5>
              <p className="leading-loose caption">{image.node.description}</p>
            </Carousel.Caption>
          </Link>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default CarouselLanding;
