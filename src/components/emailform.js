import { navigate } from "gatsby";
import React from "react";
import { Container } from "react-bootstrap";

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export const EmailForm = () => {
  const [state, setState] = React.useState({});

  const handleChange = e => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...state,
      }),
    })
      .then(() => navigate(form.getAttribute("action")))
      .catch(error => alert(error));
  };
  return (
    <Container size="xl" className=" mt-5">
      <Container className="text-center container-email-form pt-5">
        <h2 className="h2 pb-3">Subscribe below to receive updates</h2>
        <form
          name="contact"
          method="post"
          action="/thanks/"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          className="my-auto py-5"
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don’t fill this out:{" "}
              <input name="bot-field" onChange={handleChange} />
            </label>
          </p>
          <p className="pb-3">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="input"
              onChange={handleChange}
            />
          </p>
          <p>
            <button type="submit" className="shape-pill large-button hot">
              Send
            </button>
          </p>
        </form>
      </Container>
    </Container>
  );
};
