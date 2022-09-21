// Step 1: Import React
import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import CarouselLanding from "../components/carousel";

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <CarouselLanding />
      {/* <div className="spin-hero-container">
        <GatsbyImage
          image={data.contentfulAssets.asset.gatsbyImageData}
          className="spin-hero"
        />
      </div> */}
    </Layout>
  );
};

export const Head = () => <Seo title="Landing page" />;

export default IndexPage;
