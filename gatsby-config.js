const dotenv = require("dotenv").config()

module.exports = {
  siteMetadata: {
    title: `Jeroen Kortekaas`,
    description: `The artist portfolio website of Jeroen Kortekaas`,
    siteUrl: `https://www.jeroenkortekaas.com`
  },
  plugins: [
"gatsby-plugin-image",
"gatsby-plugin-sharp",
"gatsby-plugin-mdx",
"gatsby-transformer-sharp",
{
  resolve: `gatsby-source-contentful`,
  options: {
    spaceId: process.env.CONTENTFUL_SPACE_ID,
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  },
},
],
};