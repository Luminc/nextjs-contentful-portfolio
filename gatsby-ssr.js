const HtmlAttributes = {
  lang: "en",
};

const BodyAttributes = {};

exports.onRenderBody = ({ setHtmlAttributes, setBodyAttributes }) => {
  setHtmlAttributes(HtmlAttributes);
  setBodyAttributes(BodyAttributes);
};
