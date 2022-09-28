import React from "react";
import { Container } from "react-bootstrap";

export const EmailForm = () => {
  return (
    <Container size="xl" className="hero-flight mt-5">
      <Container className="text-center container-email-form pt-5">
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          className="my-auto py-5"
        >
          <h2 className="h2 pb-3">Subscribe below to receive updates</h2>
          <p className="pb-3">
            <input
              type="email"
              name="email"
              placeholder="your@email.com"
              className="input"
            />
          </p>
          <p>
            <button type="submit" className="shape-pill large-button">
              Send
            </button>
          </p>
        </form>
      </Container>
    </Container>
  );
};
