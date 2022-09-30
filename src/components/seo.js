import * as React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSiteMetadata } from "../hooks/use-site-metadata";

const Seo = ({ title, description, keywords, pathname, children }) => {
  const {
    brand: defaultTitle,
    description: defaultDescription,
    siteUrl,
    twitterUsername,
  } = useSiteMetadata();
  const seo = {
    title: title,
    brand: defaultTitle,
    description: description || defaultDescription,
    url: `${siteUrl}${pathname || ``}`,
    twitterUsername,
  };

  const { siteMetadata } = useSiteMetadata();

  return (
    <>
      <title>
        {title} — {siteMetadata.title}
      </title>
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="description" content={siteMetadata.description} />
      <meta name="twitter:creator" content={seo.twitterUsername} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:url" content={seo.url} />
      <meta name="twitter:title" content={seo.title} />
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
    </>
  );
};

export default Seo;
