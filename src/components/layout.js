import * as React from "react";
import Seo from "../components/seo";

import "./app.css";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import Container from "react-bootstrap/Container";

const Layout = ({ pageTitle, children }) => {
  return (
    <div>
      <Seo />
      <Header />
      <div className="flex-wrapper">
        <main>
          <Container>
            {pageTitle && <h1 className="display-1 py-5">{pageTitle}</h1>}
          </Container>
          {children}
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Layout;
