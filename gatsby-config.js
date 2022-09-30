require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

module.exports = {
  siteMetadata: {
    title: `Jeroen Kortekaas`,
    author: `Jeroen Kortekaas`,
    keywords: `"Art, Sculpture, Network, Animism, Agency, Entheogens, Craft`,
    description: `Jeroen Kortekaas, (1991, NL) is an interdisciplinary artist working with a practice that shifts between psychogeography, research, drawing, sculpture, and assemblage.`,
    siteUrl: `https://www.jeroenkortekaas.com`,
    eMail: `studio@jeroenkortekaas.com`,
    insta: `https://www.instagram.com/bluecarabiner`,
    instaHandle: `@bluecarabiner`,
    github: "https://github.com/luminc/",
    phone: "+31(0)615245858",
    facebook: "https://www.facebook.com/jeroen.kortekaas.77",
    twitterUsername: "luminc",
  },
  plugins: [
    "gatsby-plugin-image",
    {
      resolve: "gatsby-plugin-sharp",
      options: {
        defaults: {
          placeholder: "blurred",
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `src/assets/ico.svg`,
      },
    },
    "gatsby-plugin-mdx",
    `gatsby-plugin-sass`,
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-source-contentful`,
      options: {
        spaceId: process.env.CONTENTFUL_SPACE_ID,
        accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
      },
    },
    {
      resolve: `gatsby-source-instagram-all`,
      options: {
        access_token: process.env.INSTAGRAM_ACCESS_TOKEN,
      },
    },
    "gatsby-plugin-sitemap",

    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `images`,
    //     path: `${__dirname}/src/images`,
    //   },
    // },
  ],
};
