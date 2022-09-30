// Import React so that you can use JSX in HeadComponents
const React = require("react");

const HtmlAttributes = {
  lang: "en-GB",
};

const HeadComponents = [];

const BodyAttributes = {};

exports.onRenderBody = (
  { setHeadComponents, setHtmlAttributes, setBodyAttributes },
  pluginOptions
) => {
  setHtmlAttributes(HtmlAttributes);
  setHeadComponents(HeadComponents);
  setBodyAttributes(BodyAttributes);
};
