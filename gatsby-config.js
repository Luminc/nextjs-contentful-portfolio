require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
  siteMetadata: {
    title: `Jeroen Kortekaas`,
    author: `Jeroen Kortekaas`,
    description: `The artist portfolio website of Jeroen Kortekaas`,
    siteUrl: `https://www.jeroenkortekaas.com`,
    eMail: `studio@jeroenkortekaas.com`,
    insta: `https://www.instagram.com/bluecarabiner`,
  },
  plugins: [
"gatsby-plugin-image",
{ resolve: "gatsby-plugin-sharp",
options: {
  defaults: {
    placeholder: 'blurred',
    
  }
}
},
{
  resolve: `gatsby-plugin-manifest`,
  options: {
    icon: `src/assets/ico.svg`,
  },
},
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