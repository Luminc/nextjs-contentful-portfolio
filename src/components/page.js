import * as React from "react";
import Layout from "../components/layout";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { navigate } from "gatsby";

const Page = (heading, content, buttonLink, buttonText) => {
  return (
    <Layout>
      <Container>
        <Row>
          <Col>
            <div className="hero-flight" style={{ width: "500px" }}></div>
          </Col>
          <Col md className="p-5">
            <h1 className="display-1">{heading}</h1>
            <p className="leading-loose">{content}</p>
            <button
              onClick={() => {
                navigate({ buttonLink });
              }}
              className="shape-pill large-button"
            >
              {buttonText}
            </button>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Page;

export const Head = title => <title>{title}</title>;
