// Step 1: Import React
import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import { GatsbyImage } from "gatsby-plugin-image";
import Carousel from "react-bootstrap/Carousel";
import { graphql, Link } from "gatsby";
import { carouselStyle, cover } from "../components/layout.module.css";

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <Carousel pause={false} indicators={false} className={carouselStyle} fade>
        {data.allContentfulHeroImages.edges.map(image => (
          <Carousel.Item>
            <Link to={`/projects/${image.node.slug}`}>
              <GatsbyImage
                className={cover}
                image={image.node.image.gatsbyImageData}
                alt={image.node.description}
              />
            </Link>
            <Carousel.Caption>
              <h3>{image.node.title}</h3>
              <p>{image.node.description}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
      {/* <div className='spin-hero-container'>
      <GatsbyImage image={data.contentfulAssets.asset.gatsbyImageData} className="spin-hero"/>
    </div> */}
    </Layout>
  );
};
export const data = graphql`
  query {
    allContentfulHeroImages {
      edges {
        node {
          description
          title
          slug
          image {
            gatsbyImageData
          }
        }
      }
    }
    contentfulHeroImages {
      image {
        gatsbyImageData
      }
    }
  }
`;

export const Head = () => <Seo title="Home page" />;

export default IndexPage;
