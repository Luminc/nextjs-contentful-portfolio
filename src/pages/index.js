// Step 1: Import React
import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";
import CarouselLanding from "../components/carousel";
import { RecentProjects } from "../components/recentprojects";
import Instagram from "../components/instagram";
import { EmailForm } from "../components/emailform";
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
      <RecentProjects />
      <Instagram />
      <EmailForm />
    </Layout>
  );
};

export const Head = () => <Seo title="Landing page" />;

export default IndexPage;
