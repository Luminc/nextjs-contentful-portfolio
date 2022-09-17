/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const path = require(`path`);

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;
  const ProjectPageTemplate = path.resolve("./src/templates/allProjects.js");

  const result = await graphql(`
    {
      allContentfulProject(sort: { fields: year, order: DESC }) {
        edges {
          node {
            url
            title
            id
            featuredImage {
              gatsbyImageData(width: 600)
            }
          }
        }
      }
    }
  `);

  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`);
    return;
  }

  const ProjectPages = result.data.allContentfulProject.edges;
  ProjectPages.forEach(({ node }, index) => {
    createPage({
      path: `/projects/${node.url}`,
      component: ProjectPageTemplate,
      context: {
        id: node.id,
        prev: index === 0 ? null : ProjectPages[index - 1].node,
        next:
          index === ProjectPages.length - 1
            ? null
            : ProjectPages[index + 1].node,
      },
    });
  });
};
