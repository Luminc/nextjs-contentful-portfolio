import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSiteMetadata } from "../hooks/use-site-metadata";

const Seo = ({ title }) => {
  const { siteMetadata } = useSiteMetadata();

  return (
    <>
      <title>
        {title} — {siteMetadata.title}
      </title>
      <meta name="description" content={siteMetadata.title} />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    </>
  );
};

export default Seo;
